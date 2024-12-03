const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Use environment variables for API key
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(bodyParser.json());

app.post('/api/generate-summary', async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);  // Log to check

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',  // Use chat API endpoint
            {
                model: 'gpt-4',  // Use the correct model
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,  // Ensure API key is sent correctly
                },
            }
        );

        res.json({ summary: response.data.choices[0].message.content }); // Use correct response path
    } catch (error) {
        console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
        res.status(500).send('Error generating summary.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});