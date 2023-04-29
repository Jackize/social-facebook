import { Message, User } from "../models";
import { OPENAI_API_KEY } from "../utils/config";
const { Configuration, OpenAIApi } = require("openai");
const { v4: uuidv4 } = require("uuid");
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
export const createMessage = async (req, res) => {
    try {
        const message = await Message.create({
            conversation_id: req.body.conversation_id,
            sender_id: req.userId,
            content: req.body.content,
        });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getMessageByConversationId = async (req, res) => {
    try {
        let messages = await Message.findAll({
            where: {
                conversation_id: req.params.conversation_id,
            },
            order: [["createdAt", "DESC"]],
            limit: 10,
        });
        messages = messages.reverse();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const sendMessageGPT = async (req, res) => {
    try {
        const content = req.body.content;
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: content,
                }
            ],
            temperature: 0,
        });
        const botMsg = response.data.choices[0].message.content;
        res.status(200).send({ bot: botMsg, id: uuidv4() });
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
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
