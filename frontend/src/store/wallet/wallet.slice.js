import {createSlice} from '@reduxjs/toolkit';

export const {actions: walletActions, reducer: walletReducer} = createSlice({
    name: 'wallet',
    initialState: {
        account: null,
        networkId: null,
        walletType: null,
        isConnectedWallet: false,
    },
    reducers: {
        setAccount: (state, {payload}) => {
            state.account = payload;
        },
        setNetworkId: (state, {payload}) => {
            state.networkId = payload;
        },
        setWalletType: (state, {payload}) => {
            state.walletType = payload;
        },
        setIsWalletConnected: (state, {payload}) => {
            state.isConnectedWallet = payload;
        },

        setWallet: (state, {payload}) => {
            state.account = payload.account;
            state.walletType = payload.walletType;
            state.isConnectedWallet = payload.isConnectedWallet;
        },


        clearWallet: (state) => {
            state.account = null;
            state.signature = null;
            state.nonce = null;
            state.networkId = null;
            state.walletType = null;
            state.isConnectedWallet = false;
        }
    }
});

export const {
    setAccount,
    setNetworkId,
    setWalletType,
    setIsWalletConnected,
    clearWallet,
    setExpireDate,
    setRequestKey,
    setWallet
} =
    walletActions;
