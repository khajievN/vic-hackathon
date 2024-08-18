import React from 'react';
import {useDispatch} from 'react-redux';
import {
    clearWallet,
    setAccount,
    setIsWalletConnected,
    setNetworkId,
    setWallet,
    setWalletType
} from '../store/wallet/wallet.slice';
import {WALLET_TYPE} from "../helpers/helpers";
import {networks} from "../helpers/web3/networks";
import Web3 from "web3";
import {useMediaQuery} from "react-responsive";
import detectEthereumProvider from '@metamask/detect-provider';

const provider = await detectEthereumProvider({mustBeMetaMask: true});

const useWallet = () => {
    const isMobile = useMediaQuery({query: `(max-width: 760px)`});
    const dispatch = useDispatch();

    const handleMetaMask = () => {
        console.log("M1")
        if (isMetamaskWalletInstalled()) {
            changeNetwork('klaytn')
            getMetamaskAccount();
        } else {
            alert('Please install MetaMask');
        }
    };

    const handleKaikas = () => {
        console.log("K1")
        if (isKaikasWalletInstalled()) {
            changeNetwork('klaytn')
            getKaikasAccount();
        } else {
            alert('Please install Kaikas');
        }
    }

    function handleEthereum() {
        const {ethereum} = window;
        if (ethereum && ethereum.isMetaMask) {
            alert("Ethereum successfully detected!")
            // Access the decentralized web!
            getMetamaskAccount();
        } else {
            alert("Please install MetaMask!")
        }
    }
    async function initialize() {
        // try {
        //     const provider = new WalletConnectProvider({
        //         rpc: {
        //             // Define the network ID for Klaytn Testnet
        //             1001: networks['klaytn'].rpcUrls[0],
        //         },
        //     });
        //     // Enable session (open QR code modal)
        //     await provider.enable();
        //     // Create web3 instance
        //     const web3 = new Web3(provider);
        // } catch (e) {
        //     alert(e)
        // }
    }

    async function startApp(provider) {
        try {
            // Request account access if needed
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            alert(accounts[0])
            // You now have an array of accounts!
            // Currently, MetaMask returns only one account at a time.
        } catch (error) {
            console.error(error);
            alert(error.message)
        }
    }

    const handleClick = (type) => {
        console.log()
        if (type === WALLET_TYPE.METAMASK) {
            handleMetaMask();
        } else if (type === WALLET_TYPE.KAIKAS) {
            handleKaikas();
        }
    };

    async function getMetamaskAccount() {
        let account;
        if (isMobile) {
            let ethereum = await detectEthereumProvider();
            const result = await ethereum.request({method: 'eth_requestAccounts'});
            account = result[0]
        } else {
            window.web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            account = accounts[0];
            console.log(account);
        }


        const data = {
            account: account,
            walletType: WALLET_TYPE.METAMASK,
            isConnectedWallet: true,
        }

        dispatch(setWallet(data));
    }

    const changeNetwork = async (networkName) => {
        console.log(networkName);
        console.log(networks)
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {chainId: networks[networkName].chainId}
                ],
            });
            await getMetamaskAccount();
            const chainId = networks[networkName].networkId;
            console.log(chainId);
            dispatch(setNetworkId(chainId));
        } catch (error) {
            console.log(error);
            if (error.code === 4902) {
                console.log(networks[networkName])
                if (!window.ethereum) throw new Error("No crypto wallet found");
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: networks[networkName].chainId,
                            chainName: networks[networkName].chainName,
                            rpcUrls: networks[networkName].rpcUrls,
                            nativeCurrency: networks[networkName].nativeCurrency
                        },
                    ],
                });
                await getMetamaskAccount();
                const chainId = networks[networkName].networkId;
                console.log(chainId);
                dispatch(setNetworkId(chainId));
            }
        }

    };

    async function getKaikasAccount() {
        const accounts = await window.klaytn.enable();
        const account = accounts[0];
        const data = {
            account: account,
            walletType: WALLET_TYPE.KAIKAS,
            isConnectedWallet: true,
        }
        dispatch(setWallet(data))
    }

    function isMetamaskWalletInstalled() {
        return window.ethereum !== undefined
    }

    function isKaikasWalletInstalled() {
        return window.klaytn !== undefined
    }

    const logoutWallet = () => {
        console.log("LOGOUT");
        dispatch(setAccount(null));
        dispatch(setNetworkId(null));
        dispatch(setWalletType(null));
        dispatch(setIsWalletConnected(false));
        dispatch(clearWallet);
    };

    return {
        connectWallet: handleClick,
        logoutWallet: logoutWallet,
        selectNetwork: changeNetwork
    };
};

export default useWallet;
