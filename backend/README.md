
# GrantChain Backend

## Overview

This repository contains the backend code for the GrantChain platform, built using Express.js and MySQL. The backend is responsible for indexing blockchain contract events, subscribing to them, and writing the relevant data to a MySQL database. This ensures that the platform can efficiently process and display the necessary information related to grants, proposals, and voting.

## Technologies Used

- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features to build web and mobile applications.
- **MySQL**: A relational database management system used for storing and retrieving data related to grant projects, proposals, votes, and other related entities.

## Features

- **Event Indexing**: Subscribes to contract events emitted by the blockchain and indexes them for quick retrieval.
- **Database Management**: Stores event data in a structured manner within a MySQL database for efficient querying and analysis.
- **API Endpoints**: Provides RESTful API endpoints for interacting with the front-end and other services.

## Setup and Installation

### Prerequisites

Before running the backend, ensure you have the following installed:

- Node.js
- MySQL

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/khajievN/vic-hackathon.git
   cd grantchain-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the application**:

   ```bash
   npm start
   ```

   The backend server should now be running on `http://localhost:3000`.

## Event Subscriptions

The backend subscribes to various events emitted by the smart contracts deployed on the blockchain. These events are indexed and stored in the MySQL database. Below are the primary events that the backend listens to:

- **ProjectCreated**: Triggered when a new grant project is created.
- **ProposalSubmitted**: Triggered when a new proposal is submitted for a grant project.
- **VoteCast**: Triggered when a vote is cast on a proposal.
- **FundReleased**: Triggered when grant funds are released to a winning proposal.

## API Endpoints

The backend exposes several RESTful API endpoints to interact with the platform:

- **GET /api/project/list**: Retrieve a list of all grant projects.
- **GET /api/project/detail**: Retrieve details of a specific grant project.
- **POST /api/project/create**: Submit a new project for a grant project.
- **POST /api/proposal/create**: Submit a new proposal for a grant project.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
