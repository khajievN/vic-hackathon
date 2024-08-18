const express = require("express");
const ApiResponse = require('../models/response/apiResponse');
const router = express.Router();
const {task: proposalTask} = require('../../db/proposalController');
const {uploadToIPFSProposal} = require("../../utils/pinataUtils");


router.post('/create', async (req, res, next) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const file = req.files.file;
        const ipfsUrl = await uploadToIPFSProposal(file, name, description);
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
        const projectId = req.query.project_id;
        const page = req.query.page || 1;
        const size = req.query.page || 100;
        const results = await proposalTask.getProposalListPagination(projectId, page, size);
        const response = {
            'currentPage': results.pagination.currentPage,
            'totalPages': results.pagination.lastPage,
            'items': results.data
        };
        res.status(200).send(ApiResponse.getSuccessResponse(response));
    } catch (e) {
        next(e);
    }
});

module.exports = router;
