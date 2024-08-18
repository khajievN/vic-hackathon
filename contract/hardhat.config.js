
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');

require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // blockGasLimit: 100000000429720
    },
    klaytn: {
      url: 'https://node-api.klaytnapi.com/v1/klaytn',
      httpHeaders: {
        'x-chain-id': '1001',
        authorization: 'Basic ' + Buffer.from("XXXX" + ':' + "YYYY").toString('base64'),
      },
      chainId: 1001,
      accounts: [''],

      live: true,
      saveDeployments: true
    }
  },
  solidity: {
    version: "0.8.23",
    settings: {
      evmVersion: 'paris',
      optimizer: {
        enabled: true,
        runs: 200
      }

    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 60000
  },
  abiExporter: {
    path: './abi/',
    clear: true
  }
};
