# Matching System

This is a matching system built with Node.js and MongoDB.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
* You have a Windows machine. This guide is written for Windows.
* You have installed [MongoDB](https://www.mongodb.com/try/download/community) locally.
* You have installed [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

## Installing Matching System

To install Matching System, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/abdelrhman0-0/matching_system.git
    ```
2. Open the app in your editor

3. Install the dependencies:
    ```bash
    npm install
    ```

## Using Matching System

To use Matching System, follow these steps:

1. Start the MongoDB service.
2. Replace ./backup with your actual backup path, Import the MongoDB backup:
    ```bash
    mongorestore ./backup --drop
    ```
4. Start the server:
    ```bash
    npm start
    ```

You can now access the application at `http://localhost:3000`.

## Running with Docker

To run the application with Docker, follow these steps:
1. Replace ./backup in the docker-compose.yml file with your backup db path

2. Build and start the containers:
    ```bash
    docker-compose up --build
    ```

You can now access the application at `http://localhost:3000`.

## Running Tests

To run tests, follow these steps:

1. Ensure your MongoDB service is running.
2. Ensure you are using cmd terminal
3. Run the tests:
    ```bash
    npm test
    ```

## Contact

If you want to contact me, you can reach me at `abdelrhmanfarghaly1998@gmail.com`.