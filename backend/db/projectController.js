const {knexDb} = require("../config/database");
let task = {};

task.createProjectTransaction = async function (projectId, ownerAddress, metadata, grantAmount, name, description, fileUrl, txHash, timestamp) {
    const isExist = await knexDb('project_transaction')
        .select("*")
        .where('tx_hash', txHash.toLowerCase());

    if (isExist.length === 0) {
        await knexDb('project_transaction')
            .insert({
                project_id: projectId,
                owner_address: ownerAddress.toLowerCase(),
                metadata: metadata,
                name: name,
                description: description,
                file: fileUrl,
                timestamp: timestamp,
                grant_amount: grantAmount,
                tx_hash: txHash.toLowerCase()
            });
    }

    const isExistProject = await knexDb('project')
        .select('*')
        .where('project_id', projectId);

    if (isExistProject.length === 0) {
        await knexDb('project')
            .insert({
                project_id: projectId,
                owner_address: ownerAddress.toLowerCase(),
                metadata: metadata,
                name: name,
                description: description,
                file: fileUrl,
                grant_amount: grantAmount,
                status: 1
            });
    }
};

task.getProjectList = async function (page, size) {
    return knexDb('project')
        .select('*')
        .where('active_for_ui', 1)
        .orderBy('project_id', 'desc')
        .paginate({perPage: Number.parseInt(size), currentPage: Number.parseInt(page), isLengthAware: true});
}

task.getProjectDetail = async function (projectId) {
    return knexDb('project')
        .select('project.*', 'pt.tx_hash')
        .leftJoin(knexDb('project_transaction')
            .select('tx_hash','project_id')
            .as('pt'), function () {
            this.on('project.project_id', '=', 'pt.project_id')
        })
        .where('project.project_id', projectId)
}

task.updateProjectStatus = async function (projectId) {
    await knexDb('project')
        .update({
            status: 0
        })
        .where('project_id', projectId);
}

task.updateProjectStakeAmount = async function (projectId, proposalId) {
    const proposalRes = await knexDb('proposal').where('proposal_id', proposalId);
    if (proposalRes.length > 0) {
        const stakeAmount = proposalRes[0].stake_amount;
        const projectRes = await knexDb('project').where('project_id', projectId);
        const totalStakeAmount = projectRes[0].total_stake_amount;
        await knexDb('project')
            .update({
                total_stake_amount: Number.parseFloat(totalStakeAmount) - Number.parseFloat(stakeAmount)
            })
            .where('project_id', projectId);
    }
}

task.createFundRelease = async function (projectId, proposalId, ownerAddress, amount, txHash, timestamp) {
    const isExist = await knexDb('fund_release')
        .select("*")
        .where('tx_hash', txHash.toLowerCase());
    if (isExist.length === 0) {
        await knexDb('fund_release')
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
