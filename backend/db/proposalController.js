const {knexDb} = require("../config/database");
let task = {};

task.createProposalTransaction = async function (projectId, proposalId, ownerAddress, metadata, stakeAmount, name, description, file, txHash, timestamp) {
    const isExist = await knexDb('proposal_transaction')
        .select("*")
        .where('tx_hash', txHash.toLowerCase());
    if (isExist.length === 0) {
        await knexDb('proposal_transaction')
            .insert({
                project_id: projectId,
                proposal_id: proposalId,
                owner_address: ownerAddress.toLowerCase(),
                metadata: metadata,
                timestamp: timestamp,
                stake_amount: stakeAmount,
                tx_hash: txHash.toLowerCase()
            });
    }
    const isExistProject = await knexDb('proposal')
        .select('*')
        .where('project_id', projectId)
        .andWhere('proposal_id', proposalId);
    if (isExistProject.length === 0) {
        const projectRes = await knexDb('project').select('*').where('project_id', projectId);
        if (projectRes.length > 0) {
            const currentStakeAmount = projectRes[0].total_stake_amount || 0;
            await knexDb('project')
                .update({
                    total_stake_amount: Number.parseFloat(currentStakeAmount) + Number.parseFloat(stakeAmount)
                })
                .where('project_id', projectId);
        }
        await knexDb('proposal')
            .insert({
                project_id: projectId,
                proposal_id: proposalId,
                status: 1,
                owner_address: ownerAddress.toLowerCase(),
                metadata: metadata,
                name: name,
                description: description,
                file: file,
                stake_amount: stakeAmount,
            });
    }
};

task.updateProposal = async function (projectId, proposalId, voteAmount) {
    await knexDb('proposal')
        .update({
            total_vote_power: voteAmount
        })
        .where('project_id', projectId)
        .where('proposal_id', proposalId)
}

task.updateProposalStatus = async function (projectId, proposalId, status) {
    await knexDb('proposal')
        .update({
            status: status
        })
        .where('project_id', projectId)
        .where('proposal_id', proposalId)
}

task.getProposalHistoryListByProjectProposalId = async function (projectId, proposalId, page, size) {
    return knexDb('proposal_transaction')
        .select('*')
        .where('project_id', projectId)
        .where('proposal_id', proposalId)
        .orderBy('created_at', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}


task.getProposalHistoryListByProjectId = async function (projectId, page, size) {
    return knexDb('proposal_transaction')
        .select('*')
        .where('project_id', projectId)
        .orderBy('created_at', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}

task.getProposalList = async function (projectId) {
    return knexDb('proposal')
        .select('proposal.*', 'pt.tx_hash')
        .leftJoin(knexDb('proposal_transaction')
            .select('tx_hash', 'project_id', 'proposal_id', 'owner_address')
            .as('pt'), function () {
            this.on('proposal.proposal_id', '=', 'pt.proposal_id')
            this.andOn('proposal.project_id', '=', 'pt.project_id')
            this.andOn('proposal.owner_address', '=', 'pt.owner_address')
        })
        .where('proposal.project_id', projectId)
        .orderBy('id', 'desc')
}

task.getProposalListPagination = async function (projectId, page, size) {
    return knexDb('proposal')
        .select('*')
        .where('project_id', projectId)
        .orderBy('created_at', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}

task.getProposalDetail = async function (proposalId) {
    return knexDb('proposal')
        .select('proposal.*', 'pt.tx_hash')
        .leftJoin(knexDb('proposal_transaction')
            .select('tx_hash', 'project_id', 'proposal_id', 'owner_address')
            .as('pt'), function () {
            this.on('proposal.proposal_id', '=', 'pt.proposal_id')
            this.andOn('proposal.project_id', '=', 'pt.project_id')
            this.andOn('proposal.owner_address', '=', 'pt.owner_address')
        })
        .where('proposal.proposal_id', proposalId);
}

task.getFundRelease = async function (projectId, proposalId) {
    return knexDb('fund_release')
        .select('*')
        .where('project_id', projectId)
        .andWhere('proposal_id', proposalId)
        .orderBy('timestamp', 'desc')
}


module.exports = {
    task
}
