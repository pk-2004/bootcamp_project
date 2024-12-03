const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;
const path = require('path');

// Load environment variables (Cerebras API key)
require('dotenv').config();
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

app.use(bodyParser.json());
app.use(express.static('public'));

// POST route to generate summary using Cerebras Llama model
app.post('/api/generate-summary', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt format.' });
  }

  try {
    // Send a request to the Cerebras API for chat completion with the Llama 3.1 8B model
    const response = await axios.post(
      'https://api.cerebras.net/v1/chat/completions',
      {
        messages: [
          { role: 'user', content: prompt },
        ],
        model: 'llama3.1-8b', // Use the correct model ID
      },
      {
        headers: {
          'Authorization': `Bearer ${CEREBRAS_API_KEY}`, // Add your Cerebras API Key
          'Content-Type': 'application/json',
        },
      }
    );

    // Respond with the generated summary text from the API response
    res.json({ summary: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Error with Cerebras API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate summary. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});