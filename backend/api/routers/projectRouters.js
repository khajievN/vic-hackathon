const express = require("express");
const ApiResponse = require('../models/response/apiResponse');
const router = express.Router();
const {task: projectTask} = require('../../db/projectController');
const {task: proposalTask} = require('../../db/proposalController');
const {uploadToIPFSProject} = require("../../utils/pinataUtils");


router.post('/create', async (req, res, next) => {
    try {
        const name = req.body.title;
        const description = req.body.description;
        const grantPrice = req.body.grant_amount;
        const file = req.files.file;
        const ipfsUrl = await uploadToIPFSProject(file, name, grantPrice, description);
        const data = {
            'metadata': ipfsUrl
        }
        res.status(200).send(ApiResponse.getSuccessResponse(data));
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get('/list', async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 100;
        const results = await projectTask.getProjectList(page, size);
        let list = [];
        // bad case, should handle in query
        for (let i = 0; i < results.data.length; i++) {
            const item = results.data[i];
            let proposals = [];
            const proposalsRes = await proposalTask.getProposalList(item.project_id);
            for (let j = 0; j < proposalsRes.length; j++) {
                proposals.push(proposalsRes[j]);
            }
            list.push({
                project: {
                    project_id: item.project_id,
                    name: item.name,
                    description: item.description,
                    metadata: item.metadata,
                    owner_address: item.owner_address,
                    grant_amount: item.grant_amount,
                    total_vote_power: item.total_vote_power,
                    total_stake_amount: item.total_stake_amount,
                    status: item.status,
                },
                proposals: proposals
            })
        }
        const response = {
            'currentPage': results.pagination.currentPage,
            'totalPages': results.pagination.lastPage,
            'items': list
        };
        res.status(200).send(ApiResponse.getSuccessResponse(response));
    } catch (e) {
        next(e);
    }
});

router.get('/detail', async (req, res, next) => {
    try {
        const projectId = req.query.project_id;
        const results = await projectTask.getProjectDetail(projectId);
        let list = [];
        // bad case, should handle in query
        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            let proposals = [];
            const proposalsRes = await proposalTask.getProposalList(item.project_id);
            for (let j = 0; j < proposalsRes.length; j++) {
                proposals.push(proposalsRes[j]);
            }

            const highestVoteProposalId = item.highest_vote_proposal_id;

            let winnerProposal = {};
            if (highestVoteProposalId) {
                const highestVotePropsalRes = await proposalTask.getProposalDetail(highestVoteProposalId);
                winnerProposal = highestVotePropsalRes[0];
                const fundReleaseRes = await proposalTask.getFundRelease(item.project_id, highestVoteProposalId);
                winnerProposal.funds = fundReleaseRes;
            }

            list.push({
                project: {
                    project_id: item.project_id,
                    name: item.name,
                    description: item.description,
                    metadata: item.metadata,
                    owner_address: item.owner_address,
                    grant_amount: item.grant_amount,
                    total_vote_power: item.total_vote_power,
                    total_stake_amount: item.total_stake_amount,
                    status: item.status,
                    tx_hash: item.tx_hash
                },
                proposals: proposals,
                winnerProposal: winnerProposal
            })
        }
        res.status(200).send(ApiResponse.getSuccessResponse(list.length > 0 ? list[0] : null));
    } catch (e) {
        next(e);
    }
});


module.exports = router;
