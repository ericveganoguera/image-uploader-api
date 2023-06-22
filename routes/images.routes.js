const router = require("express").Router();

const Image = require("../models/Image.model");

// Get all the images
router.get("/", (req, res, next) => {
  Image.find()
    .then((response) => res.status(201).json(response))
    .catch((error) => res.status(401).json({ message: "Error when trying to upload" }));
});

// Get one images by id
router.get("/:imageId", (req, res, next) => {
  const { imageId } = req.params;
  Image.findById(imageId)
    .then((response) => res.status(201).json(response))
    .catch((error) => res.status(401).json({ message: "This image not exists" }));
});

// Upload an image
router.post("/upload", (req, res, next) => {
  const { name, url } = req.body;
  Image.create({ name, url })
    .then(() => res.status(201).json("Created!!"))
    .catch((error) => res.status(401).json(error.message));
});

module.exports = router;
