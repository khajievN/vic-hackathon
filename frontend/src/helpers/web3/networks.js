import {NETWORK_TYPE} from "../helpers";

export const mainnet_networks = {
    // Polygon
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        networkId: 137,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
    },
    // Klaytn
    klaytn: {
        chainId: `0x${Number(8217).toString(16)}`,
        networkId: 8217,
        chainName: "Klaytn Mainnet Cypress",
        nativeCurrency: {
            name: "Klaytn Testnet Baobab",
            symbol: "KLAY",
            decimals: 18,
        },
        rpcUrls: [
            "https://api.baobab.klaytn.net:8651"
        ],
        blockExplorerUrls: ["https://baobab.scope.klaytn.com/"],
    },
    // Ethereum mainnet
    ethereum: {
        chainId: `0x${Number(1).toString(16)}`,
        networkId: 1,
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
            name: "Ethereum Mainnet",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: ["https://eth.public-rpc.com", ""],
        blockExplorerUrls: ["https://etherscan.io"],
    },
};

export const testnet_networks = {
    // Polygon Mumbai
    polygon: {
        chainId: `0x${Number(80001).toString(16)}`,
        networkId: 80001,
        chainName: "Polygon Mumbai Testnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.matic.today"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
    // Klaytn Baobao Testnet
    klaytn: {
        chainId: `0x${Number(1001).toString(16)}`,
        networkId: 1001,
        chainName: "Klaytn Baobao Testnet",
        nativeCurrency: {
            name: "KLAY",
            symbol: "KLAY",
            decimals: 18,
        },
        rpcUrls: ["https://api.baobab.klaytn.net:8651/"],
        blockExplorerUrls: ["https://baobab.scope.klaytn.com/"],
    },
    // Ethereum Rinkeby Testnet
    ethereum: {
        chainId: `0x${Number(4).toString(16)}`,
        networkId: 4,
        chainName: "Rinkeby Test Network",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: [
            "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
    },
    vonus: {
        chainId: `0x${Number(7777).toString(16)}`,
        // networkId: 7777,
        chainName: "Vonus Test Network",
        nativeCurrency: {
            name: "Vonus",
            symbol: "VON",
            decimals: 18,
        },
        rpcUrls: [
            "https://rpcchain.vonus.org",
        ],
        blockExplorerUrls: ["https://explorer.vonus.org/"],
    },
};

export function getNetworkName(chainId) {
    console.log(chainId);
    switch (chainId) {
        case 137 :
        case 80001 :
            return NETWORK_TYPE.POLYGON;
        case 8217 :
        case 1001 :
            return NETWORK_TYPE.KLAYTN;
        case 1 :
        case 4 :
            return NETWORK_TYPE.ETHEREUM;
    }
}

export const networks =  testnet_networks
