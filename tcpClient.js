import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

function sendCommand(command) {

    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(parseInt(process.env.TCP_SERVER_PORT, 10),
        process.env.TCP_SERVER_HOST, () => {
            client.write(command);
        });

        client.on('data', (data) => {
            resolve(data.toString());
            client.destroy(); // Close connection after receiving data
        });

        client.on('error', (err) => {
            reject(err);
        });

        client.on('close', () => {
            console.log('Connection to TCP server closed');
        });
    });
}

export default sendCommand;
