require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

app.post('/sentiment', async (req, res) => {

    const { sentence } = req.body;

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Set sentiment to negative or positive based on score rules
        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult >= 0 && analysisResult <= 0.33) {
            sentiment = "neutral";
        } else {
            sentiment = "positive";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);

        // Send a status code of 200 with both sentiment score and the sentiment txt 
        return res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        // If there is an error, return a HTTP code of 500 and the json
        return res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
