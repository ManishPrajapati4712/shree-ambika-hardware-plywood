// Minimal serverless-compatible API
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Simple registration endpoint (no database, no file storage)
app.post('/api/register', (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }

        // For now, just return success
        // We'll add database storage later once this works
        const user = {
            id: Date.now(),
            name,
            phone,
            created_at: new Date().toISOString()
        };

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
});

// Export for Vercel
module.exports = app;
