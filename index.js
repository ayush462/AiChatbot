const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const HUGGINGFACE_MODEL = "facebook/blenderbot-400M-distill"; // AI Chat Model

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`,
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_KEY || ""}`, // Optional API key
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data });
    } catch (error) {
        console.error("Hugging Face API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "AI processing failed" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
