const { OPENAI_API_KEY } = require("../utils/config");
const axios = require('axios');
const { error } = require('../utils/logger');

const createImage = async (req, res) => {
    try {
        const url = "https://api.openai.com/v1/images/generations";
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        };

        // Define the textual description of the image
        const { text, size, number } = req.body;

        // Create the request body
        const data = {
            model: "image-alpha-001",
            prompt: text,
            num_images: number,
            size: size,
            response_format: "url",
        };

        // Send the POST request to the API and get the response
        const response = await axios.post(url, data, { headers });
        res.status(200).send(response.data);
    } catch (err) {
        if (err.response) {
            error(err.response.status, err.response.data.error.message);
            res.status(err.response.status).json(err.response.data.error.message);
        } else {
            error(`Error with OpenAI API request: ${err.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
};

module.exports = {
    createImage
}