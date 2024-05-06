import sendCommand from './tcpClient.js';

// Function to query the TCP server for a list of URLs
export async function checkMaliciousUrls(urls) {
    for (const url of urls) {
        const command = `2 ${url}`; // Example command to check a URL
        try {
            const response = await sendCommand(command);
            if (response.includes('true')) {
                return { url, isMalicious: true }; // Return the first flagged URL
            }
        } catch (error) {
            console.error(`Error querying TCP server for URL ${url}:`, error);
        }
    }
    return { isMalicious: false }; // Return no flagged URLs
}
