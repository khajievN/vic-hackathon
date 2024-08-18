const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,

    DB_HOST : process.env.DB_HOST,
    DB_USER : process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_SCHEMA : process.env.DB_SCHEMA,
    DB_POOL_MAX : Number.parseInt(process.env.DB_POOL_MAX),
    DB_POOL_MIN : Number.parseInt(process.env.DB_POOL_MIN),
    DB_POOL_ACQUIRE : Number.parseInt(process.env.DB_POOL_ACQUIRE),
    DB_POOL_IDLE : Number.parseInt(process.env.DB_POOL_IDLE),
    RPC_URL : process.env.RPC_URL,
    CHAIN_ID : process.env.CHAIN_ID,
    PROJECT_GRANT_CONTRACT_ADDRESS : process.env.PROJECT_GRANT_CONTRACT_ADDRESS,

    IPFS_PROJECT_ID : process.env.IPFS_PROJECT_ID,
    IPFS_PROJECT_SECRET : process.env.IPFS_PROJECT_SECRET,
    IPFS_IP : process.env.IPFS_IP,
}
