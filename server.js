const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { error } = require("console");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 8000;
//setup cloudinary config without that how can you upload it to the cloud
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});
// designing a schema
const newSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  imageUrl: String,
});
//extrating
const Imagedb = mongoose.model("Imageurl", newSchema);
//connect to mongodb
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.Url);
    console.log("mongoodb connected successfully");
  } catch (error) {
    console.log("error found here :", error);
  }
};
connectdb();
//setup cloudinarystorage config without that how can you create the folder and mention type of the image and path
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images_only",
    format: async (req, file) => "png",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});
//config multer
const upload = multer({
  storage,
  limits: 1024 * 1024 * 5,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("not a image! please upload an image"), null);
    }
  },
});
app.put("/fileupload", upload.single("image"), (req, res) => {
  if (req.file) {
    const imageuploadeddb = Imagedb.create({ imageUrl: req.file.path });
    res.json({ status: "success" });
  }
});
app.listen(port, (error) => {
  try {
    console.log(`port started at http://localhost:${port}`);
  } catch (error) {
    console.log("error found :", error);
  }
});
