const cloudinary = require('cloudinary').v2

const configCloudinary = () => {
    cloudinary.config({
        cloud_name: "diadg6tkk",
        api_secret: "z5Gb5zY5NYyPE2lnYw7WiXxEYPE",
        api_key: "356751946739663",
      });
}

module.exports = { configCloudinary };