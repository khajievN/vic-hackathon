const contracts = {
    b162_nft: {
        contract: {
            1001: "0xdAf6c9767172203eC5353Af258Ba39E5268C0471",  // klaytn testnet
            8217: "",  // klaytn mainnet
        },
    },
    operator_manager: {
        contract: {
            1001: "0x18379fF37D08b80A6165c92594F6Df9d8acA94Cc",  // klaytn testnet
            8217: "",  // klaytn mainnet
        },
        start_block: {
            1001: 97396558,  // klaytn testnet
            8217: 108476371,  // klaytn mainnet
        }
    },
    nft_fixed_market: {
        contract: {
            1001: "0xe1a42CdFB1fFba45e060F21D318fDA252A490D72",  // klaytn testnet
            8217: "",  // klaytn mainnet
        },
    },
    nft_auction_market: {
        contract: {
            1001: "0xe034F7CC17c3E14a787Ae3407C3ccC1667AB1D7f",  // klaytn testnet
            8217: "",  // klaytn mainnet
        },
    },
};

module.exports = {
    contracts
}