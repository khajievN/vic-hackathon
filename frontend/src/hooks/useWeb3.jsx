import Web3 from "web3";
import {useSelector} from "react-redux";

import {WALLET_TYPE} from "../helpers/helpers";
import {StakeHolderManagerABI} from "../helpers/web3/abi/ViralaxABI";
import {ERC20_ABI} from "../helpers/web3/abi/ERC20";
import {PROJECT_GRANT_ABI} from "../helpers/web3/abi/PROJECT_GRANT_ABI";

const web3 = new Web3(Web3.givenProvider);
const chainId = process.env.REACT_APP_CHAIN_ID;


const contractProjectGrant = process.env.REACT_APP_PROJECT_GRANT_CONTRACT_ADDRESS;
const contractGovernanceToken = process.env.REACT_APP_GOVERNANCE_TOKEN_CONTRACT_ADDRESS;
const contractProjectToken = process.env.REACT_APP_PROJECT_TOKEN_CONTRACT_ADDRESS;
const contractStakeHolderManager = process.env.REACT_APP_STAKEHOLDER_CONTRACT_ADDRESS;


const useWeb3 = () => {
    const {account, walletType} = useSelector((store) => store.wallet);

    const getEthBalance = async () => {
        console.log(web3);
        console.log(account);
        if (walletType === WALLET_TYPE.METAMASK) {
            return await web3.eth.getBalance(account);
        }
    }

    const isStakeHolder = async () => {
        let contractStakeManager = new web3.eth.Contract(StakeHolderManagerABI, contractStakeHolderManager)
        return await contractStakeManager.methods.isStakeholder(account).call()
    }

    const getGasPrice = async () => {
        return await web3.eth.getGasPrice();
    }

    const getBalanceProjectToken = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractProjectToken);
        return await contractPT.methods.balanceOf(account).call();
    }

    const getBalanceGovernanceToken = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractGovernanceToken);
        return await contractPT.methods.balanceOf(account).call();
    }

    const checkAllowanceForCreateProject = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractProjectToken);
        return await contractPT.methods.allowance(account, contractProjectGrant).call();
    }

    const approveForCreateProject = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractProjectToken);
        const gasLimit = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .estimateGas(
                {
                    from: account
                }
            )
        const gasPrice = await getGasPrice();
        const res = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const createProject = async (metadata, grantAmount) => {
        let contractPG = new web3.eth.Contract(PROJECT_GRANT_ABI, contractProjectGrant);
        grantAmount = Web3.utils.toWei(grantAmount, 'ether');
        const gasLimit = await contractPG.methods.createProject(metadata, grantAmount)
            .estimateGas({
                from: account
            });
        console.log("createProjectGasLimit", gasLimit);
        const gasPrice = await getGasPrice();
        const res = await contractPG.methods.createProject(metadata, grantAmount)
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const closeProject = async (projectId) => {
        let contractPG = new web3.eth.Contract(PROJECT_GRANT_ABI, contractProjectGrant);
        const gasLimit = await contractPG.methods.finaliseProject(projectId)
            .estimateGas({
                from: account
            });
        console.log("closeProjectGasLimit", gasLimit);
        const gasPrice = await getGasPrice();
        const res = await contractPG.methods.finaliseProject(projectId)
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const checkAllowanceForCreateProposal = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractGovernanceToken);
        return await contractPT.methods.allowance(account, contractProjectGrant).call();
    }

    const approveForCreateProposal = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractProjectToken);
        const gasLimit = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .estimateGas(
                {
                    from: account
                }
            )
        const gasPrice = await getGasPrice();
        const res = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const createProposal = async (projectId, metadata, stakeAmount) => {
        console.log("projectId", projectId)
        console.log("metadata", metadata)
        console.log("stakeAmount", stakeAmount)
        let contractPG = new web3.eth.Contract(PROJECT_GRANT_ABI, contractProjectGrant);
        stakeAmount = Web3.utils.toWei(stakeAmount, 'ether');
        const gasLimit = await contractPG.methods.createProposal(projectId, stakeAmount, metadata)
            .estimateGas({
                from: account
            });
        console.log("createProposalGasLimit", gasLimit);
        const gasPrice = await getGasPrice();
        const res = await contractPG.methods.createProposal(projectId, stakeAmount, metadata)
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }


    const checkAllowanceForCreateVote = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractGovernanceToken);
        return await contractPT.methods.allowance(account, contractProjectGrant).call();
    }

    const approveForCreateVote = async () => {
        let contractPT = new web3.eth.Contract(ERC20_ABI, contractGovernanceToken);
        const gasLimit = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .estimateGas(
                {
                    from: account
                }
            )
        const gasPrice = await getGasPrice();
        const res = await contractPT.methods.approve(contractProjectGrant, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const createVote = async (projectId, proposalId, votePower) => {
        let contractPG = new web3.eth.Contract(PROJECT_GRANT_ABI, contractProjectGrant);
        votePower = Web3.utils.toWei(votePower, 'ether');
        const gasLimit = await contractPG.methods.vote(projectId, proposalId, votePower)
            .estimateGas({
                from: account
            });
        console.log("createVoteGasLimit", gasLimit);
        const gasPrice = await getGasPrice();
        const res = await contractPG.methods.vote(projectId, proposalId, votePower)
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }

    const releaseFund = async (projectId, amount) => {
        let contractPG = new web3.eth.Contract(PROJECT_GRANT_ABI, contractProjectGrant);
        amount = Web3.utils.toWei(amount, 'ether');
        const gasLimit = await contractPG.methods.releaseFund(projectId, amount)
            .estimateGas({
                from: account
            });
        console.log("createReleaseGasLimit", gasLimit);
        const gasPrice = await getGasPrice();
        const res = await contractPG.methods.releaseFund(projectId, amount)
            .send({
                from: account,
                gas: gasLimit,
                gasPrice: gasPrice
            });
        return res.transactionHash;
    }


    return {
        // common
        getEthBalance,
        isStakeHolder,
        getGasPrice,
        getBalanceProjectToken,
        getBalanceGovernanceToken,
        // create project
        checkAllowanceForCreateProject,
        approveForCreateProject,
        createProject,

        // close project
        closeProject,

        // create proposal
        checkAllowanceForCreateProposal,
        approveForCreateProposal,
        createProposal,

        // create vote
        checkAllowanceForCreateVote,
        approveForCreateVote,
        createVote,

        // release fund
        releaseFund

    };
}


export default useWeb3;
