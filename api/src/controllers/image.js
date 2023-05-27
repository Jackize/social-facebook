import { OPENAI_API_KEY } from "../utils/config.js";
import axios from 'axios';
export const createImage = async (req, res) => {
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
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data.error.message);
            res.status(error.response.status).json(error.response.data.error.message);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
};
