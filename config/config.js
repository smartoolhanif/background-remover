import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

// Log the current working directory and .env file location
console.log('Current working directory:', process.cwd());
console.log('.env file path:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

// Try to load .env file, but don't fail if it doesn't exist
try {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }
} catch (error) {
    console.warn('Warning: .env file not found, using process.env');
}

// Debug: Log environment variables (but mask the actual values)
console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
console.log('REMOVE_BG_API_KEY exists:', !!process.env.REMOVE_BG_API_KEY);

// Use environment variables with fallbacks
export const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY || '',
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
    TEMP_DIR: process.env.TEMP_DIR || join(process.cwd(), 'temp'),
    DAILY_LIMIT: parseInt(process.env.DAILY_LIMIT || '10'),
    ADMIN_IDS: (process.env.ADMIN_IDS || '5260441331').split(','),
    ADMIN_COMMANDS: {
        '/setlimit': 'Set daily credit limit',
        '/addadmin': 'Add new admin',
        '/removeadmin': 'Remove admin',
        '/broadcast': 'Send message to all users',
        '/stats': 'View bot statistics',
        '/banuser': 'Ban a user',
        '/unbanuser': 'Unban a user',
        '/addcredits': 'Add credits to user',
        '/resetlimit': 'Reset user\'s daily limit',
        '/createcode': 'Create a redeem code',
        '/listcodes': 'List all active redeem codes',
        '/deletecode': 'Delete a redeem code'
    },
    REDEEM: {
        CODE_LENGTH: parseInt(process.env.REDEEM_CODE_LENGTH || '8'),
        MAX_USES: parseInt(process.env.REDEEM_MAX_USES || '100')
    },
    FIREBASE: {
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
        databaseURL: process.env.FIREBASE_DATABASE_URL || '',
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.FIREBASE_APP_ID || '',
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
    }
};

// Validate required environment variables
const requiredVars = [
    'TELEGRAM_BOT_TOKEN',
    'REMOVE_BG_API_KEY',
    'FIREBASE_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.error('Current environment:', {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
    });
    // Don't throw error, just log warning
    console.warn('Bot may not function correctly without required environment variables');
}

// Create temp directory if it doesn't exist
try {
    if (!fs.existsSync(config.TEMP_DIR)) {
        fs.mkdirSync(config.TEMP_DIR, { recursive: true });
    }
} catch (error) {
    console.warn('Could not create temp directory:', error.message);
}

// Log confirmation of loaded config
console.log('Configuration loaded successfully'); 