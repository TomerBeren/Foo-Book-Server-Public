import { response } from 'express';
import sendCommand from './tcpClient.js';

// Function to query the TCP server for a list of URLs
export async function checkMaliciousUrls(urls) {
    for (const url of urls) {
        const command = `2 ${url}`; // Example command to check a URL
        try {
            const response = await sendCommand(command);
            // Check if the response contains the word 'false', which means it's not malicious
            if (response.includes('false')) {
                return { url, isMalicious: false, response }; // Not malicious because it contains 'false'
            } else {
                return { url, isMalicious: true, response }; // Considered malicious if 'false' is not part of the response
            }
        } catch (error) {
            console.error(`Error querying TCP server for URL ${url}:`, error);
        }
    }
    return { isMalicious: false, response }; // Return no flagged URLs if none match the criteria
}
