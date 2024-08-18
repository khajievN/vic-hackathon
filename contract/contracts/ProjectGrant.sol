// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./stakeholder/IStakeHolder.sol";

contract ProjectGrant is Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    using SafeMath for uint256;

    mapping(uint256 => string) private _tokenURIs;
    Counters.Counter private _projectTracker;
    Counters.Counter private _proposalTracker;

    address public governanceToken; // stakeholders vote token by their power
    address public projectToken; // users (professors or students) stake token to show commitment

    address public stakeholderManager;

    struct Project {
        uint256 projectId;
        uint256 totalVotePower;
        uint256 totalStakedAmount;
        address owner;
        string metadata;
        uint256 grantAmount;
        uint256 highestVotedProposalId;
        bool status;
    }

    struct Proposal {
        uint256 proposalId;
        uint256 projectId;
        uint256 totalVotePower;
        uint256 stakeAmount;
        address owner;
        string metadata;
        bool status;
    }

    struct Vote {
        uint256 proposalId;
        uint256 projectId;
        uint256 votePower;
        address owner;
        bool status;
    }

    mapping(uint256 => Project) public projectMap;
    mapping(uint256 => mapping(uint256 => Proposal)) public proposalMap;
    mapping(uint256 => mapping(uint256 => Vote)) public voteMap;
    mapping(uint256 => uint256) public releaseFundMap;

    event ProjectCreate(uint256 projectId, address owner, string metadata, uint256 grantAmount);
    event ProjectFinish(uint256 projectId, bool status);
    event ProposalCreate(uint256 projectId, uint256 proposalId, address owner, string metadata, uint256 stakeAmount);
    event ProposalCancel(uint256 projectId, uint256 proposalId);
    event VoteCreate(uint256 projectId, uint256 proposalId, address owner, uint256 votePower, uint256 highestVotedProposalId);
    event ReleaseFund(uint256 projectId, uint256 proposalId, address owner, uint256 amount);
    event ClaimVote(uint256 projectId, uint256 proposalId, address owner, uint256 amount);



    modifier stakeholdersOnly() {
        require(IStakeHolder(stakeholderManager).isStakeholder(msg.sender), "#stakeholdersOnly:");
        _;
    }


    constructor(address _governanceToken, address _projectToken,
        address _stakeholderManager) public {
        // to start index from 1
        governanceToken = _governanceToken;
        projectToken = _projectToken;
        stakeholderManager = _stakeholderManager;
        _projectTracker.increment();
        _proposalTracker.increment();
    }

    function createProject(string memory _metadata, uint256 _grantAmount) external onlyOwner nonReentrant {
        // first deposit _grantAmount
        IERC20(projectToken).transferFrom(msg.sender, address(this), _grantAmount);
        // set _metadata
        _tokenURIs[_projectTracker.current()] = _metadata;
        // initilize Project
        projectMap[_projectTracker.current()] = Project(_projectTracker.current(), 0, 0, msg.sender, _metadata, _grantAmount, 0, true);
        // publish event
        emit ProjectCreate(_projectTracker.current(), msg.sender, _metadata, _grantAmount);
        // increment tokenId
        _projectTracker.increment();
    }

    function vote(uint256 _projectId, uint256 _proposalId, uint256 _amount) external stakeholdersOnly nonReentrant {
        Project storage project = projectMap[_projectId];
        require(project.status, "#notActiveProject");
        Proposal storage proposal = proposalMap[_projectId][_proposalId];
        // deposit governance token
        IERC20(governanceToken).transferFrom(msg.sender, address(this), _amount);
        // add vote power to proposal
        proposal.totalVotePower = proposal.totalVotePower.add(_amount);
        // add vote power to project
        project.totalVotePower = project.totalVotePower.add(_amount);
        // init vote
        voteMap[_projectId][_proposalId] = Vote(_projectId, _proposalId, _amount, msg.sender, true);
        if (proposal.totalVotePower > proposalMap[_projectId][project.highestVotedProposalId].totalVotePower) {
            project.highestVotedProposalId = _proposalId;
        }
        // publish event
        emit VoteCreate(_projectId, _proposalId, msg.sender, _amount, project.highestVotedProposalId);
    }

    function createProposal(uint256 _projectId, uint256 _amount, string memory _metadata) external nonReentrant {
        Project storage project = projectMap[_projectId];
        require(project.status, "#notActiveProject");
        // not stake holders stake
        IERC20(projectToken).transferFrom(msg.sender, address(this), _amount);
        // add staked amount to totalStake
        project.totalStakedAmount = project.totalStakedAmount.add(_amount);
        // init Proposal
        proposalMap[_projectId][_proposalTracker.current()] = Proposal(_projectId, _proposalTracker.current(), 0,
            _amount, msg.sender, _metadata, true);
        // publish event
        emit ProposalCreate(_projectId, _proposalTracker.current(), msg.sender, _metadata, _amount);
        // increment tokenId
        _proposalTracker.increment();
    }

    function cancelProposal(uint256 _projectId, uint256 _proposalId) external nonReentrant {
        Project storage project = projectMap[_projectId];
        Proposal storage proposal = proposalMap[_projectId][_proposalId];
        require(proposal.owner == msg.sender, "#onlyStaker");
        require(proposal.status, "#alreadyCanceled");
        // change status
        proposal.status = false;
        // sub staked amount from totalStake
        project.totalStakedAmount = project.totalStakedAmount.sub(proposal.stakeAmount);
        // stake holders stake
        IERC20(projectToken).transfer(proposal.owner, proposal.stakeAmount);
        // publish event
        emit ProposalCancel(_projectId, proposal.proposalId);
    }

    function claimVote(uint256 _projectId, uint256 _proposalId) external nonReentrant {
        Project storage project = projectMap[_projectId];
        require(!project.status, "#activeProject");
        Vote storage vote = voteMap[_projectId][_proposalId];
        require(vote.owner == msg.sender, "#onlyStakeHolder");
        require(vote.status, "#alreadyClaimed");
        // set as claimed
        vote.status = true;
        // stake holders stake
        IERC20(projectToken).transfer(vote.owner, vote.votePower);
        // publish event
        emit ClaimVote(_projectId, _proposalTracker.current(), msg.sender, vote.votePower);
    }

    function finaliseProject(uint256 _projectId) external onlyOwner nonReentrant {
        Project storage project = projectMap[_projectId];
        require(project.status, "#notActiveProject");
        project.status = false;
        emit ProjectFinish(_projectId, project.status);
    }

    function releaseFund(uint256 _projectId, uint256 _amount) external onlyOwner nonReentrant {
        Project storage project = projectMap[_projectId];
        require(!project.status, "#activeProject");
        uint256 winningProposalId = project.highestVotedProposalId;
        Proposal storage winningProposal = proposalMap[_projectId][winningProposalId];
        uint256 releasedAmount = releaseFundMap[_projectId];
        require(releasedAmount.add(_amount) <= project.grantAmount, "#notEnoughGrant");
        releaseFundMap[_projectId] = releasedAmount.add(_amount);
        IERC20(projectToken).transfer(winningProposal.owner, _amount);
        emit ReleaseFund(_projectId, winningProposalId, winningProposal.owner, _amount);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string memory baseURI = _tokenURIs[tokenId];
        return baseURI;
    }

}
