import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Button} from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import useWallet from "../../hooks/useWallet";
import {WALLET_TYPE} from "../../helpers/helpers";
import useWeb3 from "../../hooks/useWeb3";

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {connectWallet, logoutWallet} = useWallet();
    const {isStakeHolder} = useWeb3();
    const {isConnectedWallet, account} = useSelector((store) => store.wallet);
    const [isStakeHold, setStakeHolder] = useState(false);

    const handleNetwork = async () => {
        if (isConnectedWallet) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log("accounts", accounts);
                if (account?.includes(accounts[0])) return
                connectWallet(WALLET_TYPE.METAMASK)
                checkWalletType();
            })
            // const isUnLocked = await window.ethereum._metamask.isUnlocked()
            // if (!isUnLocked) {
            //     logoutWallet()
            // }

        }
    }
    useEffect(() => {
        handleNetwork()
        checkWalletType();
    }, []);

    const handleButtonClick = () => {
        if (isConnectedWallet) {
            logoutWallet();
        } else {
            connectWallet(WALLET_TYPE.METAMASK);
        }
    };

    const checkWalletType = async () => {
        if (isConnectedWallet && account) {
            const isStakeH = await isStakeHolder();
            console.log("isStakeH", isStakeH)
            setStakeHolder(isStakeH);
        }
    }

    // Check if the current path is either /createProject or /createProposal
    const isCreateOrProposalPage = location.pathname === '/';


    return (
        <AppBar position="static">
            <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                {isCreateOrProposalPage ? (
                    <Button color="inherit"
                            onClick={() => navigate(isStakeHold ? '/createProject' : '/')}>
                        {isStakeHold ? 'Create' : 'Home'} Project
                    </Button>
                ) : (
                    <Button color="inherit"
                            onClick={() => navigate('/')}>
                        Home
                    </Button>
                )}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h6" style={{marginRight: '20px'}}>
                        {isConnectedWallet && account ? account : ''}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleButtonClick}>
                        {isConnectedWallet ? 'Logout' : 'Connect'}
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
