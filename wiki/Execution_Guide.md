# Environment Setup

This guide outlines the steps to set up the environment necessary for running the TCP server and the Node.js server, which are part of the FooBook application ecosystem.

## Prerequisites

Before you begin, make sure you have Docker and Node.js installed on your system. Docker will be used to run the TCP server, and Node.js will run the web server for FooBook.

- **Docker**: Download and install from [Docker Hub](https://hub.docker.com/).
- **Node.js**: Download and install from [Node.js official website](https://nodejs.org/).

## Clone the Repositories

Start by cloning the repositories for the TCP server and the Node.js server:

### TCP Server Repository

Clone and navigate into the directory of the TCP server:

```bash
git clone https://github.com/TomerBeren/FooBook-TCP-Server-Public
cd FooBook-TCP-Server-Public
```

### Node.js Server Repository

Clone and navigate into the directory of the Node.js server:

```bash
git clone https://github.com/TomerBeren/FooBook-Server-Public
cd FooBook-Server-Public
```
## Launching the Dockerized TCP Server

To deploy the TCP server using Docker, follow these steps:

1. **Pull the Docker Image** Ensure Docker is installed on your system. You can download it from [Docker Hub](https://hub.docker.com/). Then, pull the Docker image using the following command:
   ```bash
   docker pull tomerberen/advancedsysprogproject:v1.0.3
   ```

2. **Run the Docker Container** Run the Docker container, ensuring that the TCP server is properly mapped to the correct ports on your local machine:
    ```bash
    docker run -i -t -p 5542:5542 tomerberen/advancedsysprogproject:v1.0.3
    ```
    This command starts the TCP server and binds it to port 5542 on your localhost, allowing the Node.js server to communicate with it.
      
   ![Screenshot 2024-05-07 110734](https://github.com/TomerBeren/FooBook_Server/assets/118894673/a599293d-f6d1-4493-b877-f63e99da62a4)

## Alternative: Running TCP Server Locally with Makefile

If you prefer to run the TCP server without Docker, you can use the Makefile provided in the repository:

1. **Build the Server** Navigate to the TCP server directory and build the server using:
    ```bash
    make
    ```

2. **Run the Server** After building, start the server with:
    ```bash
    ./my_program
    ```

    This will start the TCP server locally without Docker.

## Setting Up the Node.js Server

After setting up the TCP server, proceed to configure the Node.js server:

1. **Install Dependencies** While in the Node.js server's directory, install the required npm packages:
    ```bash
    npm install
    ```
2. **Environment Variables** Set up the necessary environment variables or modify the .env file as needed to configure the database connection and other settings crucial for the Node.js server.

3. **Start the Server** Run the Node.js server using:
    ```bash
    npm start
    ```
    
    ![Screenshot 2024-05-07 202918](https://github.com/TomerBeren/FooBook_Server/assets/118894673/b96ebe6c-8048-4bcf-875d-7c6a05e8a34b)

This command will start the FooBook web server, which should now be able to communicate with the TCP server for operations requiring URL filtering.

## Accessing the Web Client

Once both servers are running, access the FooBook web client through your browser by navigating to http://localhost:8080 (or whichever port your Node.js server is configured to use).

This README guide ensures that both the TCP server and the Node.js server are up and running, and outlines how to access the web client for full application functionality.

## Additional Resources

For more detailed information on starting and managing the server, please refer to the
FooBook_Server repository under the following link:
[FooBook Server Detailed README](https://github.com/TomerBeren/FooBook_Server)
