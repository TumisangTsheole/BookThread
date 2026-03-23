import * as https from 'https';
import * as http from 'http';

let iterations = 0;
const DELAY_SECONDS = 10; // Change this to your desired delay

const sleep = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const isAlive = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        // Parse the URL to determine which protocol to use
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;
        
        const request = protocol.get(url, (response) => {
            const isHealthy = response.statusCode === 200;
            resolve(isHealthy);
        });
        
        request.on('error', (error) => {
            console.error(`ERROR: Backend IS DOWN! ${error.message}`);
            resolve(false);
        });
        
        request.end();
    });
}

async function runHealthCheck() {
    // For HTTPS with self-signed certificates or specific SSL options, you can add:
    // const httpsAgent = new https.Agent({
    //     rejectUnauthorized: false // Only use this for development!
    // });
    
    while (true) {
        // const backendHealth = await isAlive("http://localhost:5164/api/Health");
       const backendHealth = await isAlive("https://bookthread.onrender.com/api/Health");
        console.log(`[${new Date().toISOString()}] Backend health: ${backendHealth ? 'UP ✅' : 'DOWN ❌'}`);
        iterations += 1;
        console.log(`Total checks: ${iterations}`);
        
        console.log(`Waiting ${DELAY_SECONDS} seconds before next check...`);
        await sleep(DELAY_SECONDS);
    }
}

console.log(`Starting health check every ${DELAY_SECONDS} seconds...`);
runHealthCheck().catch(console.error);
