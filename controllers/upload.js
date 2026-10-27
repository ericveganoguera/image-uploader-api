const mime = require("mime-types");
const { MongoClient, GridFSBucket } = require("mongodb");
const upload = require("../middleware/upload");
const dbConfig = require("../config/db");

const mongoClient = new MongoClient(dbConfig.url);

// Public URL of an image, built from the request so it works on any host
const fileUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/files/${encodeURIComponent(filename)}`;

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "You must select a file." });
    }

    return res.status(201).send({
      message: "File has been uploaded.",
      filename: req.file.filename,
      url: fileUrl(req, req.file.filename),
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).send({ message: "The image must be 2 MB or smaller." });
    }
    if (error.code === "INVALID_FILE_TYPE") {
      return res.status(415).send({ message: error.message });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE" || error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).send({ message: "Upload a single image in the \"file\" field." });
    }
    console.error("Upload error:", error);
    return res.status(500).send({ message: "The image could not be uploaded. Please try again." });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();
    const images = mongoClient
      .db(dbConfig.database)
      .collection(dbConfig.imgBucket + ".files");

    const files = await images.find({}, { projection: { filename: 1 } }).toArray();
    if (files.length === 0) {
      return res.status(404).send({ message: "No files found!" });
    }

    return res.status(200).send(
      files.map((doc) => ({ name: doc.filename, url: fileUrl(req, doc.filename) }))
    );
  } catch (error) {
    console.error("List error:", error);
    return res.status(500).send({ message: "The images could not be listed." });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();
    const bucket = new GridFSBucket(mongoClient.db(dbConfig.database), {
      bucketName: dbConfig.imgBucket,
    });

    const downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("file", () => {
      res.set("Content-Type", mime.lookup(req.params.name) || "application/octet-stream");
      res.set("Cache-Control", "public, max-age=86400");
    });
    downloadStream.on("error", () => {
      if (!res.headersSent) {
        res.status(404).send({ message: "Image not found." });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).send({ message: "The image could not be downloaded." });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
};
