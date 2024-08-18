let config = require('../env/config')
const QuickNode = require("@quicknode/sdk");
const quickNode = new QuickNode.Core(
    {
        endpointUrl: config.RPC_URL,
        config: {
            addOns: {nftTokenV2: true}
        }
    });
module.exports = {
    quickNode
}

