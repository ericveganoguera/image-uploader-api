const crypto = require("crypto");
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const EXTENSIONS = { "image/png": ".png", "image/jpeg": ".jpg" };

function buildMongoUri(uri, dbName) {
  const [base, query] = uri.split("?");
  const baseWithSlash = base.endsWith("/") ? base : `${base}/`;
  return query ? `${baseWithSlash}${dbName}?${query}` : `${baseWithSlash}${dbName}`;
}

const storage = new GridFsStorage({
  url: buildMongoUri(dbConfig.url, dbConfig.database),
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  // Unique name for each upload, so two files called "photo.jpg" never overwrite each other
  file: (req, file) => ({
    bucketName: dbConfig.imgBucket,
    filename: crypto.randomBytes(16).toString("hex") + EXTENSIONS[file.mimetype],
    metadata: { originalName: file.originalname },
  }),
});

// Reject anything that is not a PNG or JPEG before it reaches the database
const fileFilter = (req, file, cb) => {
  if (EXTENSIONS[file.mimetype]) return cb(null, true);
  const error = new Error("You must select a valid format image (PNG or JPEG).");
  error.code = "INVALID_FILE_TYPE";
  cb(error);
};

const uploadFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
}).single("file");

module.exports = util.promisify(uploadFiles);
module.exports.MAX_FILE_SIZE = MAX_FILE_SIZE;
