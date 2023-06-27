const router = require("express").Router();
const uploadController = require("../controllers/upload.js");

router.post("/upload", uploadController.uploadFiles);
router.get("/", uploadController.getListFiles);
router.get("/files/:name", uploadController.download);

module.exports = router;