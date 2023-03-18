import { Message, User } from "../models";
const { Configuration, OpenAIApi } = require("openai");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
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
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: `${content}`,
            temperature: 1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        const botMsg = response.data.choices[0].text; // store the bot message in a variable
        // console.log();
        res.status(200).send({ bot: botMsg, id: uuidv4() });
    } catch (error) {
        res.status(500).send({ error });
    }
};
