export class ErrorHandler {
    static async handleError(error, context = '') {
        console.error(`Error in ${context}:`, {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // You could add error reporting service here
        // For now, just log to console
    }

    static setupGlobalHandlers() {
        process.on('uncaughtException', (err) => {
            this.handleError(err, 'uncaughtException');
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.handleError(reason, 'unhandledRejection');
        });
    }
} 