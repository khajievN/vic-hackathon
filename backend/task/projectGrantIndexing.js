const Web3 = require("web3");

const {task: lastBlockTask} = require('../db/chainController');
const {task: projectTask} = require('../db/projectController');
const {task: proposalTask} = require('../db/proposalController');
const {task: voteTask} = require('../db/voteController');
const {sleep, getTokenNetwork, convert} = require("../utils/utility");
let config = require('../env/config')
const {PROJECT_GRANT_ABI} = require("../utils/abi/PROJECT_GRANT_ABI");
const {knexDb} = require("../config/database");
const axios = require("axios");


async function startProjectGrantIndexing() {
    const web3Instance = new Web3(new Web3.providers.HttpProvider(config.RPC_URL));
    let moveToNext = false;
    const contract = new web3Instance.eth.Contract(PROJECT_GRANT_ABI, config.PROJECT_GRANT_CONTRACT_ADDRESS);
    while (true) {
        try {
            let lastBlockNumber = Number.parseFloat(await lastBlockTask.getLastBlockProjectGrant()) + 1;
            // let lastBlockNumber = 541705;
            const blockExtender = 1000;
            const getLatestBlockNumber = await web3Instance.eth.getBlockNumber();
            let toBlockNumber = lastBlockNumber + blockExtender;
            if (toBlockNumber > getLatestBlockNumber) {
                toBlockNumber = getLatestBlockNumber;
            }
            const options = {
                fromBlock: lastBlockNumber, toBlock: toBlockNumber,
            };
            const transferSingle = await contract.getPastEvents("allEvents", options);
            if (transferSingle.length > 0) {
                await saveTransactions(transferSingle, web3Instance);
            }
            lastBlockNumber = toBlockNumber;
            await lastBlockTask.updateLastBlockProjectGrant(lastBlockNumber);
            console.log(`Last Skipped Fetched block = ${lastBlockNumber}`)
            await sleep(5000);
        } catch (e) {
            moveToNext = true;
            await sleep(5000);
        }
    }
}

async function saveTransactions(results, web3Instance) {
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const blockNumber = result.blockNumber;
        const blockData = await web3Instance.eth.getBlock(blockNumber);
        const timestamp = blockData.timestamp;
        const contractAddress = result.address;
        const txHash = result.transactionHash;
        const projectId = result.returnValues['projectId'];
        const owner = result.returnValues['owner'];
        switch (result.event) {
            case 'ProjectCreate':
                const projectMetadata = result.returnValues['metadata'];
                const projectGrantAmount = Web3.utils.fromWei(result.returnValues['grantAmount'], 'ether');
                const projectMetadataResult = await axios.get(projectMetadata);
                await projectTask.createProjectTransaction(projectId, owner, projectMetadata, projectGrantAmount,
                    projectMetadataResult.data.name,
                    projectMetadataResult.data.description,
                    projectMetadataResult.data.file,
                    txHash, timestamp)
                break;
            case 'ProposalCreate':
                const proposalId = result.returnValues['proposalId'];
                const proposalMetadata = result.returnValues['metadata'];
                const proposalMetadataResult = await axios.get(proposalMetadata);
                const proposalStakeAmount = Web3.utils.fromWei(result.returnValues['stakeAmount'], 'ether');
                await proposalTask.createProposalTransaction(projectId, proposalId, owner, proposalMetadata, proposalStakeAmount,
                    proposalMetadataResult.data.name,
                    proposalMetadataResult.data.description,
                    proposalMetadataResult.data.file,
                    txHash, timestamp)
                break;

            case 'VoteCreate' :
                let voteProposalId = result.returnValues['proposalId'];
                let votePower = Web3.utils.fromWei(result.returnValues['votePower'], 'ether');
                let highestVotedProposalId = result.returnValues['highestVotedProposalId'];
                await voteTask.createVoteTransaction(projectId, voteProposalId, votePower, owner, txHash, timestamp, highestVotedProposalId);
                break;

            case 'ProposalCancel' :
                let cancelProposalId = result.returnValues['proposalId'];
                // update status : 0
                await proposalTask.updateProposalStatus(projectId, cancelProposalId, 0);
                // subtract total_staked_amount
                await projectTask.updateProjectStakeAmount(projectId, cancelProposalId)
                break;

            case 'ProjectFinish' :
                let projectStatus = result.returnValues['status'];
                await projectTask.updateProjectStatus(projectId);
                break;

            case 'ReleaseFund' :
                let releaseProposalId = result.returnValues['proposalId'];
                let releaseAmount = Web3.utils.fromWei(result.returnValues['amount'], 'ether');
                await projectTask.createFundRelease(projectId, releaseProposalId, owner, releaseAmount, txHash, timestamp);
                break;

            case 'ClaimVote' :
                let claimProposalId = result.returnValues['proposalId'];
                let claimAmount = Web3.utils.fromWei(result.returnValues['amount'], 'ether');
                await voteTask.createClaimVote(projectId, claimProposalId, owner, claimAmount, txHash, timestamp);
                break
        }

        // Update the last block number after processing the transactions
        await lastBlockTask.updateLastBlockProjectGrant(blockNumber);
    }
}

module.exports = {
    startProjectGrantIndexing,
};
