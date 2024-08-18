const {knexDb} = require("../config/database");
let task = {};


task.getLastBlockProjectGrant = async function () {
    const res = await knexDb('chain')
        .select("last_block_project_grant");
    return res[0]['last_block_project_grant']
}

task.updateLastBlockProjectGrant = async function (blockNumber) {
    await knexDb('chain')
        .update({
            last_block_project_grant: blockNumber
        }).where('id', 1)
}


module.exports = {
    task
}
