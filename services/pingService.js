import axios from 'axios';

export class PingService {
    constructor(url) {
        this.url = url;
        this.startPinging();
    }

    startPinging() {
        setInterval(async () => {
            try {
                await axios.get(this.url);
                console.log('Ping successful');
            } catch (error) {
                console.error('Ping failed:', error.message);
            }
        }, 5 * 60 * 1000); // Ping every 5 minutes
    }
} 