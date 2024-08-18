
# GrantChain: Decentralized Participatory Granting Platform using DAO

## Overview

GrantChain is a decentralized platform that redefines the grant awarding process by leveraging blockchain technology and decentralized governance. It ensures transparency, inclusivity, and community-driven decision-making, enabling government officials to submit grant projects on-chain and allowing participants to submit their proposals by staking tokens. The selection process is governed by a Voting DAO, where stakeholders use governance tokens to vote on the proposals.

## Key Components

### 1. **Frontend**
   - **Framework:** React.js with Material UI
   - **Description:** The frontend provides a user-friendly interface where government officials can submit grant projects, and participants can submit proposals and vote. The UI is responsive and built to offer a seamless user experience.

### 2. **Smart Contracts**
   - **GovernanceToken.sol:** ERC20 token used for voting within the DAO.
   - **ProjectToken.sol:** ERC20 token used for staking by participants submitting proposals.
   - **StakeHolderManager.sol:** Manages the addition and removal of stakeholders who can vote.
   - **ProjectGrant.sol:** Core contract for managing grant projects, proposals, voting, and fund release.

### 3. **Backend**
   - **Framework:** Express.js
   - **Database:** MySQL
   - **Description:** The backend is responsible for indexing blockchain contract events, subscribing to them, and writing the relevant data to a MySQL database. It also provides RESTful API endpoints for interacting with the frontend and other services.

### 4. **Blockchain Integration**
   - **Blockchain Node:** Connects the backend to the Ethereum blockchain.
   - **Smart Contracts:** Deployed on the Ethereum blockchain to manage the grant projects, proposals, and voting.

## Features

- **Decentralized Governance:** Community-driven voting using a DAO to decide on grant awards.
- **Staking Mechanism:** Participants stake ProjectTokens to submit proposals, ensuring commitment.
- **Transparent Fund Release:** Grants are released to the winning proposals based on community voting.
- **Event Indexing:** Backend subscribes to blockchain events, ensuring up-to-date data in the database.
- **User-friendly Interface:** The frontend is designed to be intuitive and accessible to all users, regardless of their technical expertise.

## Deployment

### Prerequisites

- Node.js
- MySQL
- Ethereum Node (or Infura)
- Truffle or Hardhat for contract deployment

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/khajievN/vic-hackathon.git
   ```

2. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```

4. **Deploy Smart Contracts**:
   - Use Truffle or Hardhat to deploy the smart contracts on an Ethereum network.
   - Update the contract addresses in both the frontend and backend configurations.


5. **Run the backend**:

   ```bash
   cd backend
   npm start
   ```

6. **Run the frontend**:

   ```bash
   cd frontend
   npm start
   ```

   The frontend should now be accessible at `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
