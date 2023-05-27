import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "./config.js";

import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
});

export const handleDeleteImage = async (imageURL) => {
    const filenameWithoutExtension = imageURL.match(/\/([^/.]+)(\.[^.]+)$/)[1];
    await cloudinary.api.delete_resources([filenameWithoutExtension], function (error, result) {
        return result;
    });
};
