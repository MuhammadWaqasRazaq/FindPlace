const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // <-- pass the instance here
    params: {
        folder: "findplace_dev",
        allowed_formats: ["png", "jpg", "jpeg"], // <-- correct key: allowed_formats
    }
});

module.exports = {
    cloudinary,
    storage,
}