# TCP Server Integration - URL Checking

This branch of the FooBook Server repository introduces the integration of URL checking functionalities with a TCP server. It leverages Node.js `net` module to establish TCP connections and perform URL validation to enhance the application's security.

## Overview

The primary addition in this branch is the implementation of a TCP client within the Node.js environment to communicate with an external TCP server that runs a Bloom filter. This setup helps identify and block malicious URLs before they affect the system.

## Key Features

- **TCP Client Setup**: Utilizes Node.js `net` module to create TCP connections for sending commands and receiving responses.
- **URL Validation**: Sends URLs to the TCP server to check against a Bloom filter, determining if they are considered safe.
- **Environment Configuration**: Uses `dotenv` for environment variable management to configure TCP server connection details.

## Setup

Ensure you have Node.js and the necessary environment variables configured to run the integration:

- **TCP_SERVER_PORT**: The port on which the TCP server is listening.
- **TCP_SERVER_HOST**: The hostname or IP address of the TCP server.
- **BAD_URLS**: A comma-separated list of URLs to be loaded into the Bloom filter at server startup.

## How It Works

### Sending Commands to TCP Server

The `sendCommand` function is responsible for creating a TCP connection, sending a command to the TCP server, and handling the response. Here's how it works:

- **Connection**: Opens a TCP connection to the specified server and port.
- **Command Execution**: Sends a command (e.g., to check or add URLs to the Bloom filter).
- **Response Handling**: Receives the server's response and resolves the promise with the received data.

### Checking URLs for Malicious Content

The `checkMaliciousUrls` function queries the TCP server to determine if any of the provided URLs are malicious, based on the Bloom filter's response.

### Initializing Bloom Filter with Bad URLs

At server startup, `initializeBadUrls` is called to load a predefined list of malicious URLs into the Bloom filter. This is critical for setting up the initial state of the Bloom filter with known bad URLs.

## Example Usage

The code is designed to be used as part of the server's startup sequence or within specific routes where URL checking is necessary. It provides a layer of security by interfacing with the TCP server to leverage advanced URL filtering techniques.

This branch is a crucial component in enhancing the security infrastructure of the FooBook platform through efficient and effective URL checking.
