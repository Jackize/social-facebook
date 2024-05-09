const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = require("./config");

const cloudinary = require("cloudinary");

cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
});

/**
 * Deletes an image from Cloudinary.
 *
 * @param {string} imageURL - The URL of the image to be deleted.
 * @returns {Promise} - A promise that resolves with the result of the deletion.
 */
const handleDeleteImage = async (imageURL) => {
    const filenameWithoutExtension = imageURL.match(/\/([^/.]+)(\.[^.]+)$/)[1];
    await cloudinary.api.delete_resources([filenameWithoutExtension], function (error, result) {
        return result;
    });
};

module.exports = { handleDeleteImage };