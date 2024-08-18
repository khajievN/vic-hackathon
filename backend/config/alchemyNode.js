const { Network, Alchemy } = require('alchemy-sdk');
let config = require('../env/config')
// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: config.ALCHEMY_RPC_URL, // Replace with your Alchemy API Key.
    network: Network.MATIC_MAINNET, // Replace with your network.
};

const alchemyNode = new Alchemy(settings);

module.exports = {
    alchemyNode
}
