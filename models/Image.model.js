const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const imagesSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: [true, "Name is unique"]
    },
    url: {
        type: String,
        required: [true, "URL is required"],
        unique: [true, "URL is unique"]
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Images = model("Images", imagesSchema);

module.exports = Images;
