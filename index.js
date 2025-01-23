import express from 'express';
import { TelegramBotService } from './services/telegramBot.js';
import { PingService } from './services/pingService.js';

const app = express();
const port = process.env.PORT || 3000;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).send('Something broke!');
});

// Initialize bot outside of try-catch to make it accessible
let bot = null;

async function startBot() {
    try {
        console.log('Starting Background Remover Bot...');
        bot = new TelegramBotService();
        console.log('Bot is running...');
    } catch (error) {
        console.error('Error starting bot:', error);
        // Don't exit process, just log the error
        return false;
    }
    return true;
}

// Health check endpoint
app.get('/', async (req, res) => {
    if (!bot) {
        // Try to start bot if it's not running
        const started = await startBot();
        if (!started) {
            res.status(500).send('Bot is not running');
            return;
        }
    }
    res.send('Bot is running!');
});

// Start server and bot
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    
    // Start bot after server is running
    const started = await startBot();
    if (started) {
        // Only start pinging if bot started successfully
        const appUrl = process.env.APP_URL || `http://localhost:${port}`;
        new PingService(appUrl);
    }
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (bot) {
        bot.stop();
    }
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log the error
}); 