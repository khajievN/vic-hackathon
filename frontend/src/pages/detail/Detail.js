import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    CircularProgress,
    Chip,
    Grid,
    Button,
    Modal,
    Stepper,
    Step,
    StepLabel,
    Link,
    Accordion, AccordionSummary, AccordionDetails, LinearProgress, Slider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {getProjectDetailApi} from '../../hooks/useAPI';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BadgeIcon from '@mui/icons-material/Badge';
import LinkIcon from '@mui/icons-material/Link';  // Importing the Link Icon
import {useSelector} from 'react-redux';
import useWeb3 from "../../hooks/useWeb3";

const Detail = () => {
    const navigate = useNavigate();
    const {project_id} = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const {isConnectedWallet, account} = useSelector((store) => store.wallet);

    const {closeProject, checkAllowanceForCreateVote, approveForCreateVote, createVote, releaseFund} = useWeb3();

    const [loadingClose, setLoadingClose] = useState(false);
    const [activeStepClose, setActiveStepClose] = useState(0);
    const stepsClose = ['Closing project'];

    const [loadingVote, setLoadingVote] = useState(false);
    const [activeStepVote, setActiveStepVote] = useState(0);
    const stepsVote = ['Approving', 'Voting'];

    const [openVoteModal, setOpenVoteModal] = useState(false);
    const [votePower, setVotePower] = useState(0);
    const [proposalForVote, setProposalForVote] = useState(null);


    const [success, setSuccess] = useState(false);

    const [totalFundRelease, setTotalFundRelease] = useState(0);
    const [fundProgress, setFundProgress] = useState(0);
    const [maxReleaseAmount, setMaxReleaseAmount] = useState(0);

    // State for the modal and current proposal
    const [openProposalModal, setOpenProposalModal] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const [openReleaseModal, setOpenReleaseModal] = useState(false);
    const [releaseAmount, setReleaseAmount] = useState(0);
    const [releaseLoading, setReleaseLoading] = useState(false);


    const handleOpenReleaseModal = () => {
        setReleaseAmount(0);
        setOpenReleaseModal(true);
    };

    const handleCloseReleaseModal = () => {
        setOpenReleaseModal(false);
    };

    const handleSliderChange = (event, newValue) => {
        setReleaseAmount(newValue);
    };

    const handleReleaseSubmit = async () => {
        try {
            console.log(`Releasing ${releaseAmount} from the grant amount`);
            setReleaseLoading(true);
            const res = await releaseFund(project_id, releaseAmount.toString());
            console.log('releaseRes', res)
            await fetchProjectDetails();
            // Add logic to handle the fund release here
            handleCloseReleaseModal();
        } catch (e) {
            console.log(e);
        } finally {
            setReleaseLoading(false);
        }
    };


    const handleOpenProposalModal = (proposal) => {
        setSelectedProposal(proposal);
        setOpenProposalModal(true);
    };

    const handleCloseProposalModal = () => {
        setOpenProposalModal(false);
        setSelectedProposal(null);
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [project_id]);

    useEffect(() => {
        if (projectData) {
            if (projectData.winnerProposal) {
                // Calculate the total funds released
                const totalFundsReleased = projectData.winnerProposal.funds.reduce((acc, fund) => acc + fund.amount, 0);
                // Calculate progress percentage
                const progress = (totalFundsReleased / project.grant_amount) * 100;

                setMaxReleaseAmount(projectData.project.grant_amount - totalFundsReleased)
                setTotalFundRelease(totalFundsReleased);
                setFundProgress(progress);
            }

        }

    }, [projectData])

    const fetchProjectDetails = async () => {
        try {
            setSuccess(false);
            const response = await getProjectDetailApi({
                project_id: project_id
            });
            setProjectData(response.data.data);
            console.log("detail", response.data.data);


            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch project details:", error);
            setLoading(false);
        }
    };


    if (loading) {
        return (<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress/>
        </Box>);
    }

    if (!projectData || !projectData.project) {
        return (<Box p={3}>
            <Typography variant="h6" color="error">
                Project details not found.
            </Typography>
        </Box>);
    }

    const {project, proposals} = projectData;

    const handleCloseProject = async () => {
        try {
            setLoadingClose(true);
            setActiveStepClose(0);
            await closeProject(project_id);
            setLoadingClose(false);
            await fetchProjectDetails();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeProposal = async () => {
        navigate(`/createProposal/${project_id}`);
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getStatusLabel = (status) => {
        return status === 0 ? "Finished" : "Ongoing";
    };

    const getStatusColor = (status) => {
        return status === 0 ? "success" : "warning"; // Material UI color names
    };

    const handleOpenVoteModal = (proposal) => {
        setProposalForVote(proposal);
        setOpenVoteModal(true);
    };


    const handleCloseVoteModal = () => {
        setOpenVoteModal(false);
        setVotePower('');
    };

    const handleVoteSubmit = async () => {
        try {
            setLoadingVote(true);
            setActiveStepVote(0);
            const allowance = await checkAllowanceForCreateVote();
            console.log("allowance", allowance);
            if (Number.parseFloat(allowance) <= 0) {
                const approveRes = await approveForCreateVote();
                console.log('approveRes', approveRes);
            }
            setActiveStepVote(1);
            const createProjectRes = await createVote(project_id, proposalForVote.proposal_id, votePower);
            console.log('createProjectRes', createProjectRes);
            setActiveStepVote(2);
            setLoadingVote(false);
            await fetchProjectDetails();
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingVote(false);
        }


        console.log(`Voting with ${votePower} power on proposal ${proposalForVote.proposal_id}`);
        // Add logic to submit the vote
        handleCloseVoteModal();
    };

    return (<Box p={3}>
        <Card>
            <Grid container spacing={2}>
                {/* Left Side: Image */}
                <Grid item xs={12} md={5}>
                    <Box
                        height="300px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor={getRandomColor()}
                        position="relative"
                    >
                        <Typography
                            variant="h1"
                            color="white"
                            fontWeight="bold"
                        >
                            {project.name.charAt(0)}
                        </Typography>
                        <Box
                            position="absolute"
                            top={8}
                            right={8}
                        >
                            <Chip
                                label={getStatusLabel(project.status)}
                                color={getStatusColor(project.status)}
                            />
                        </Box>
                    </Box>


                </Grid>

                {/* Right Side: Title and Description */}
                <Grid item xs={12} md={7}>
                    <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                            {project.name}
                        </Typography>

                        <Typography variant="body1" dangerouslySetInnerHTML={{__html: project.description}}/>

                        {/* Project Properties */}
                        <Box mt={4}>
                            <Chip
                                icon={<AccountCircleIcon/>}
                                label={`Owner: ${project.owner_address}`}
                                color="primary"
                                variant="outlined"
                                sx={{mb: 1}}
                            />
                            <Chip
                                icon={<AttachMoneyIcon/>}
                                label={`Grant Amount: ${project.grant_amount}`}
                                color="secondary"
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                            <Chip
                                icon={<HowToVoteIcon/>}
                                label={`Total Vote Power: ${project.total_vote_power || 'N/A'}`}
                                color="success"
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                            <Chip
                                icon={<AccountBalanceWalletIcon/>}
                                label={`Total Stake Amount: ${project.total_stake_amount || 'N/A'}`}
                                color="warning"
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                            <Chip
                                icon={<BadgeIcon/>}
                                label={`Status: ${project.status === 1 ? 'Active' : 'Inactive'}`}
                                color={project.status === 1 ? 'success' : 'error'}
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                        </Box>

                        {/* Project Transaction Hash */}
                        {project.tx_hash && (<Box mt={2}>
                            <Link href={`https://baobab.klaytnscope.com/tx/${project.tx_hash}`} target="_blank"
                                  rel="noopener">
                                <Chip
                                    icon={<LinkIcon/>}
                                    label={`Transaction Hash: ${project.tx_hash}`}
                                    color="info"
                                    variant="outlined"
                                />
                            </Link>
                        </Box>)}

                        {/* Conditionally Rendered Button */}
                        {project.status === 1 && account && (<Box mt={2} display="flex" justifyContent="center">
                            {project.owner_address.toLowerCase() === account.toLowerCase() ? (
                                <Button variant="contained" color="error" onClick={handleCloseProject}>
                                    Close Project
                                </Button>) : (
                                <Button variant="contained" color="primary" onClick={handleMakeProposal}>
                                    Make Proposal
                                </Button>)}
                        </Box>)}
                    </CardContent>
                </Grid>
            </Grid>
        </Card>

        {project.status === 0 && projectData.winnerProposal && (
            <Box mt={4} mb={2}>
                <Typography variant="h5" gutterBottom>Winner Proposal</Typography>
                <Card variant="outlined" sx={{borderColor: 'gold', borderWidth: 2}}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Proposal #{projectData.winnerProposal.proposal_id} (Winner)
                        </Typography>
                        <Box mt={2}>
                            <Chip
                                icon={<AccountCircleIcon/>}
                                label={`Owner: ${projectData.winnerProposal.owner_address}`}
                                color="primary"
                                variant="outlined"
                                sx={{mb: 1}}
                            />
                            <Chip
                                icon={<HowToVoteIcon/>}
                                label={`Total Vote Power: ${projectData.winnerProposal.total_vote_power || 'N/A'}`}
                                color="success"
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                            <Chip
                                icon={<AccountBalanceWalletIcon/>}
                                label={`Stake Amount: ${projectData.winnerProposal.stake_amount || 'N/A'}`}
                                color="warning"
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                            <Chip
                                icon={<BadgeIcon/>}
                                label={`Status: ${projectData.winnerProposal.status === 1 ? 'Active' : 'Inactive'}`}
                                color={projectData.winnerProposal.status === 1 ? 'success' : 'error'}
                                variant="outlined"
                                sx={{mb: 1, ml: 1}}
                            />
                        </Box>

                        {/* Progress Bar for Funds Released */}
                        <Box mt={2}>
                            <Typography variant="body2" gutterBottom>
                                Funds Released: {totalFundRelease}/{project.grant_amount}
                            </Typography>
                            <LinearProgress variant="determinate" value={fundProgress}/>
                        </Box>

                        <Typography variant="body2" color="text.secondary" mt={2}
                                    dangerouslySetInnerHTML={{__html: projectData.winnerProposal.description}}/>

                        {projectData.winnerProposal.file && (
                            <Box mt={2}>
                                <Typography variant="body2">
                                    <strong>File:</strong>
                                    <Link href={projectData.winnerProposal.file} target="_blank" rel="noopener"
                                          sx={{ml: 1}}>
                                        {projectData.winnerProposal.file.split('/').pop()}
                                    </Link>
                                </Typography>
                            </Box>
                        )}

                        {/* Accordion for Released Funds Transaction Hashes */}
                        {projectData.winnerProposal.funds.length > 0 && (
                            <Box mt={4}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>Released Funds Transactions</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {projectData.winnerProposal.funds.map((fund, index) => (
                                            <Box key={index} mt={1}>
                                                <Typography variant="body2">
                                                    <strong>Amount:</strong> {fund.amount} PT
                                                </Typography>
                                                <Link href={`https://baobab.klaytnscope.com/tx/${fund.tx_hash}`} target="_blank"
                                                      rel="noopener">
                                                    <Chip
                                                        icon={<LinkIcon/>}
                                                        label={`Transaction Hash: ${fund.tx_hash}`}
                                                        color="info"
                                                        variant="outlined"
                                                        sx={{mt: 1}}
                                                    />
                                                </Link>
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        )}

                        {/* Release Fund Button */}
                        {projectData.project.grant_amount > totalFundRelease && (
                            <Box mt={4}>
                                <Button variant="contained" color="primary" onClick={handleOpenReleaseModal}>
                                    Release Fund
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        )}

        <Typography variant="h5" gutterBottom>Proposal List</Typography>
        {proposals.map((proposal) => (<Grid item xs={12} key={proposal.proposal_id}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Proposal #{proposal.proposal_id}
                    </Typography>
                    <Box mt={2}>
                        <Chip
                            icon={<AccountCircleIcon/>}
                            label={`Owner: ${proposal.owner_address}`}
                            color="primary"
                            variant="outlined"
                            sx={{mb: 1}}
                        />
                        <Chip
                            icon={<HowToVoteIcon/>}
                            label={`Total Vote Power: ${proposal.total_vote_power || 'N/A'}`}
                            color="success"
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                        <Chip
                            icon={<AccountBalanceWalletIcon/>}
                            label={`Stake Amount: ${proposal.stake_amount || 'N/A'}`}
                            color="warning"
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                        <Chip
                            icon={<BadgeIcon/>}
                            label={`Status: ${proposal.status === 1 ? 'Active' : 'Inactive'}`}
                            color={proposal.status === 1 ? 'success' : 'error'}
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => handleOpenProposalModal(proposal)}
                        sx={{mt: 2}}
                    >
                        View
                    </Button>
                    {project.status === 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{marginLeft: 20}}
                            onClick={() => handleOpenVoteModal(proposal)}
                            sx={{mt: 2}}
                        >
                            Vote
                        </Button>)}

                </CardContent>
            </Card>
        </Grid>))}

        <Modal open={loadingClose} onClose={() => {
        }}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
            >
                <Typography variant="h6" gutterBottom>
                    Processing...
                </Typography>
                <Stepper activeStep={activeStepClose}>
                    {stepsClose.map((label, index) => (<Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>))}
                </Stepper>
            </Box>
        </Modal>

        <Modal open={loadingVote} onClose={() => {
        }}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
            >
                <Typography variant="h6" gutterBottom>
                    Processing...
                </Typography>
                <Stepper activeStep={activeStepVote}>
                    {stepsVote.map((label, index) => (<Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>))}
                </Stepper>
            </Box>
        </Modal>

        <Modal open={success} onClose={() => {
        }}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
                textAlign="center"
            >
                <Typography variant="h6" gutterBottom>
                    Success!
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    Reloading....
                </Typography>
            </Box>
        </Modal>

        <Modal open={openProposalModal} onClose={handleCloseProposalModal}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
            >
                {selectedProposal && (<>
                    <Typography variant="h6" gutterBottom>
                        Proposal #{selectedProposal.proposal_id}
                    </Typography>

                    <Typography variant="body1"
                                dangerouslySetInnerHTML={{__html: selectedProposal.description}}/>


                    {selectedProposal.file && (<Box mt={2}>
                        <Typography variant="body2">
                            <strong>File:</strong>
                            <Link href={selectedProposal.file} target="_blank" rel="noopener" sx={{ml: 1}}>
                                {selectedProposal.file.split('/').pop()} {/* Display the file name */}
                            </Link>
                        </Typography>
                    </Box>)}

                    <Box mt={2}>
                        <Chip
                            icon={<AccountCircleIcon/>}
                            label={`Owner: ${selectedProposal.owner_address}`}
                            color="primary"
                            variant="outlined"
                            sx={{mb: 1}}
                        />
                        <Chip
                            icon={<HowToVoteIcon/>}
                            label={`Total Vote Power: ${selectedProposal.total_vote_power || 'N/A'}`}
                            color="success"
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                        <Chip
                            icon={<AccountBalanceWalletIcon/>}
                            label={`Stake Amount: ${selectedProposal.stake_amount || 'N/A'}`}
                            color="warning"
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                        <Chip
                            icon={<BadgeIcon/>}
                            label={`Status: ${selectedProposal.status === 1 ? 'Active' : 'Inactive'}`}
                            color={selectedProposal.status === 1 ? 'success' : 'error'}
                            variant="outlined"
                            sx={{mb: 1, ml: 1}}
                        />
                    </Box>

                    {selectedProposal.tx_hash && (<Box mt={2}>
                        <Link href={`https://baobab.klaytnscope.com/tx/${selectedProposal.tx_hash}`} target="_blank"
                              rel="noopener">
                            <Chip
                                icon={<LinkIcon/>}
                                label={`Transaction Hash: ${selectedProposal.tx_hash}`}
                                color="info"
                                variant="outlined"
                            />
                        </Link>
                    </Box>)}

                    <Typography variant="body2" color="text.secondary" mt={2}>
                        <strong>Created At:</strong> {new Date(selectedProposal.created_at).toLocaleString()}
                    </Typography>
                </>)}
            </Box>
        </Modal>

        <Modal open={openVoteModal} onClose={handleCloseVoteModal}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
            >
                {proposalForVote && (<>
                    <Typography variant="h6" gutterBottom>
                        Vote on Proposal #{proposalForVote.proposal_id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {proposalForVote.name}
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                            Enter your Vote Power:
                        </Typography>
                        <input
                            type="number"
                            value={votePower}
                            onChange={(e) => setVotePower(e.target.value)}
                            style={{padding: '10px', width: '100%', marginBottom: '20px'}}
                        />
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleVoteSubmit}>
                        Submit Vote
                    </Button>
                </>)}
            </Box>
        </Modal>

        <Modal open={openReleaseModal} onClose={handleCloseReleaseModal}>
            <Box
                p={6}
                bgcolor="background.paper"
                borderRadius={1}
                maxWidth="600px"
                mx="auto"
                mt={10}
            >
                <Typography variant="h6" gutterBottom>
                    Release Funds
                </Typography>
                <Box mt={4}>
                    <Typography variant="body2" gutterBottom>
                        Select the amount to release:
                    </Typography>
                    <Slider
                        value={releaseAmount}
                        onChange={handleSliderChange}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        max={maxReleaseAmount}
                    />
                    <Typography variant="body2" gutterBottom>
                        Selected Amount: {releaseAmount} PT
                    </Typography>
                </Box>
                {releaseLoading ? (
                    <CircularProgress/>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleReleaseSubmit} sx={{mt: 4}}>
                        Submit
                    </Button>
                )}
            </Box>
        </Modal>
    </Box>);
};

export default Detail;
