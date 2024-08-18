const {knexDb} = require("../config/database");
let task = {};


task.createVoteTransaction = async function (projectId, proposalId, votePower, ownerAddress, txHash, timestamp, highestVotedProposalId) {
    const isExist = await knexDb('vote')
        .select("*")
        .where('tx_hash', txHash.toLowerCase());

    if (isExist.length === 0) {

        // update project info
        const projectRes = await knexDb('project').select('*').where('project_id', projectId);
        if (projectRes.length > 0) {
            const currentVotePower = projectRes[0].total_vote_power || 0;
            await knexDb('project')
                .update({
                    highest_vote_proposal_id: highestVotedProposalId,
                    total_vote_power: Number.parseFloat(currentVotePower) + Number.parseFloat(votePower)
                })
                .where('project_id', projectId);
        }

        // update proposal id
        const proposalRes = await knexDb('proposal').select('*').where('proposal_id', proposalId);
        if (proposalRes.length > 0) {
            const currentVotePower = projectRes[0].total_vote_power || 0;
            await knexDb('proposal')
                .update({
                    total_vote_power: Number.parseFloat(currentVotePower) + Number.parseFloat(votePower)
                })
                .where('proposal_id', proposalId)
                .andWhere('project_id', projectId);
        }

        await knexDb('vote')
            .insert({
                project_id: projectId,
                proposal_id: proposalId,
                owner_address: ownerAddress.toLowerCase(),
                vote_power: votePower,
                timestamp: timestamp,
                tx_hash: txHash.toLowerCase()
            });
    }
};

task.getVoteListByProjectId = async function (projectId, page, size) {
    return knexDb('vote')
        .select('*')
        .where('project_id', projectId)
        .orderBy('created_at', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}

task.getVoteListByProjectProposal = async function (projectId, proposalId, page, size) {
    return knexDb('vote')
        .select('*')
        .where('project_id', projectId)
        .where('proposal_id', proposalId)
        .orderBy('created_at', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}

task.getVoteDetail = async function (voteId) {
    return knexDb('vote')
        .select('*')
        .where('id', voteId)
}

task.createClaimVote = async function (projectId, proposalId, ownerAddress, amount, txHash, timestamp) {
    const isExist = await knexDb('vote_claim')
        .select("*")
        .where('tx_hash', txHash.toLowerCase());
    if (isExist.length === 0) {
        await knexDb('vote_claim')
            .insert({
                project_id: projectId,
                proposal_id: proposalId,
                owner_address: ownerAddress.toLowerCase(),
                timestamp: timestamp,
                amount: amount,
                tx_hash: txHash.toLowerCase()
            });
    }
}


module.exports = {
    task
}
