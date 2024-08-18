const {ethers} = require("hardhat");
const Web3 = require("web3");
const {min} = require("hardhat/internal/util/bigint");

async function deployGovernanceToken() {
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    let governanceToken = await GovernanceToken.deploy("Governance Token", "GT");
    console.log("governanceToken deployed to:", governanceToken.address);
}

async function deployProjectToken() {
    const ProjectToken = await ethers.getContractFactory("ProjectToken");
    let projectToken = await ProjectToken.deploy("Project Token", "PT");
    console.log("projectToken deployed to:", projectToken.address);
}


async function deployStakeHolderManager() {
    const StakeHolderManager = await ethers.getContractFactory("StakeHolderManager");
    let stakeHolderManager = await StakeHolderManager.deploy();
    console.log("stakeHolderManager deployed to:", stakeHolderManager.address);
}

async function addStakeHolder() {
    const stakeHolderManagerAddress = '0x96d2FA6581aAF46289425a39A193F364F202b532';
    const StakeHolderManager = await ethers.getContractFactory("StakeHolderManager");
    let stakeHolderManager = await StakeHolderManager.attach(stakeHolderManagerAddress);
    await stakeHolderManager.addStakeholder("0x4091320130802794fc301642b8d61d090E419477");
}

async function deployProjectGrant() {
    const governanceTokenContractAddress = "0xfDd60b5C4FCc9C51B6D8C077BA9890255bacC62C";
    const projectTokenContractAddress = "0xC0A1124eA9Cc3D800DD1847D47E674b097e6e256";
    const stakeHolderManagerContractAddress = "0x96d2FA6581aAF46289425a39A193F364F202b532";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.deploy(governanceTokenContractAddress, projectTokenContractAddress, stakeHolderManagerContractAddress);
    console.log("projectGrant deployed to:", projectGrant.address);
}

async function transferProjectToken() {
    const projectTokenContractAddress = "0xC0A1124eA9Cc3D800DD1847D47E674b097e6e256";
    const ProjectToken = await ethers.getContractFactory("ProjectToken");
    let projectToken = await ProjectToken.attach(projectTokenContractAddress);

    await projectToken.transfer("0xF10bAd9d0c9226DE6595c4Aaca49b60b06F390f8", Web3.utils.toWei("1000", "ether"));
}

async function createProject() {
    const projectGrantContractAddress = "0x8fE2cB5da65EAC1F8324F3DD8d7260c742e1B06A";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectTokenContractAddress = "0xC0A1124eA9Cc3D800DD1847D47E674b097e6e256";
    const ProjectToken = await ethers.getContractFactory("ProjectToken");
    let projectToken = await ProjectToken.attach(projectTokenContractAddress);

    // await projectToken.approve(projectGrantContractAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

    await projectGrant.createProject("Test IPFS", Web3.utils.toWei("100", "ether"))
}

async function createProposal() {
    const projectGrantContractAddress = "0x8fE2cB5da65EAC1F8324F3DD8d7260c742e1B06A";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectTokenContractAddress = "0xC0A1124eA9Cc3D800DD1847D47E674b097e6e256";
    const ProjectToken = await ethers.getContractFactory("ProjectToken");
    let projectToken = await ProjectToken.attach(projectTokenContractAddress);

    // await projectToken.approve(projectGrantContractAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

    const projectId = 1;
    const amount = Web3.utils.toWei("5", "ether");
    const metadata = "Proposal Metadata";
    await projectGrant.createProposal(projectId, amount, metadata);

}

async function createVote() {
    const projectGrantContractAddress = "0x8fE2cB5da65EAC1F8324F3DD8d7260c742e1B06A";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const governanceTokenContractAddress = "0xfDd60b5C4FCc9C51B6D8C077BA9890255bacC62C";
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    let governanceToken = await GovernanceToken.attach(governanceTokenContractAddress);

    // await governanceToken.approve(projectGrantContractAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

    const projectId = 1;
    const proposalId = 1;
    const amount = Web3.utils.toWei("5", "ether");
    await projectGrant.vote(projectId, proposalId, amount);

}

async function finishProject() {
    const projectGrantContractAddress = "0x8fE2cB5da65EAC1F8324F3DD8d7260c742e1B06A";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectId = 1;
    await projectGrant.finaliseProject(projectId)
}

async function cancelProposal() {
    const projectGrantContractAddress = "0x8fE2cB5da65EAC1F8324F3DD8d7260c742e1B06A";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectId = 1;
    const proposalId = 1;
    await projectGrant.cancelProposal(projectId, proposalId);
}


async function claimVote() {
    const projectGrantContractAddress = "0x83Bd6076b8AbC8D94C2902285C9cF4b9FBbC0843";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectId = 1;
    const proposalId = 1;

    await projectGrant.claimVote(projectId, proposalId);
}

async function releaseFund() {
    const projectGrantContractAddress = "0x83Bd6076b8AbC8D94C2902285C9cF4b9FBbC0843";
    const ProjectGrant = await ethers.getContractFactory("ProjectGrant");
    let projectGrant = await ProjectGrant.attach(projectGrantContractAddress);

    const projectId = 1;
    const amount = Web3.utils.toWei("98", 'ether');

    await projectGrant.releaseFund(projectId, amount);
}


addStakeHolder()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
