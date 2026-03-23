// Use import instead of require (if your environment supports ES modules)
import * as http from 'http';

const sleep = (ms: number, callback: () => void) => {
    setTimeout(callback, ms);
}

const isAlive = (url: string, callback: (result: boolean) => void) => {
    const request = http.get(url, (response) => {
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            sleep(1000, () => {
                callback(true);
            });
        } else {
            callback(false);
        }
    });
    
    request.on('error', () => {
        console.error('Error checking backend health');
        callback(false);
    });
    
    request.end();
}

isAlive("http://localhost:5164/api/Health", (backendHealth) => {
    console.log(backendHealth);
});
