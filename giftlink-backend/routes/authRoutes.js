const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
const logger = pino(); 
dotenv.config();
const { body, validationResult } = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', 
    // Add validation checks
    [
        body('email').isEmail().withMessage('Enter a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required')
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
            const db = await connectToDatabase();

            // Access MongoDB collection
            const collection = db.collection("users");

            // Check for existing email
            const existingEmail = await collection.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already in use' });
            }

            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(req.body.password, salt);

            // Save user details in database
            await collection.insertOne({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post('/login', async (req, res) => {
    console.log("\n\n Inside login")
    try {
        // const collection = await connectToDatabase();
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });
        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
            if(!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong pasword' });
            }
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
      }
});

router.put('/update', async (req, res) => {
    // Validate the input using `validationResult` and return message if there is an error.
    const errors = validationResult(req);
    // Check if `email` is present in the header and throw an error message if not present
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: "Email not found in the request headers" });
        }
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // Find user credentials
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }
        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();
        // Update user credentials in DB
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );
        // Create JWT authentication with user._id as payload using secret key from .env file
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');
        res.json({ authtoken });
    } catch (error) {
        logger.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;