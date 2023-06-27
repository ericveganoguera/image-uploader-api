const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = file.originalname
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: file.originalname
    };
  },
  // Disable compression
  options: { zlib: false }
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;