import React, {useState} from 'react';
import {
    Box, Button, TextField, Typography, InputLabel, Input, FormControl, Modal, Stepper, Step, StepLabel
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {createProjectMetadataApi, createProposalMetadataApi} from "../../hooks/useAPI";
import useWeb3 from "../../hooks/useWeb3";
import {useNavigate, useParams} from "react-router-dom";

const CreateProposal = () => {
    const {project_id} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [grantPrice, setGrantPrice] = useState('20');
    const [file, setFile] = useState(null);
    const {checkAllowanceForCreateProposal, approveForCreateProposal, createProposal} = useWeb3();
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const steps = ['Creating metadata', 'Approving', 'Creating'];

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setActiveStep(0); // Set the first step as active

            // Step 1: Creating metadata
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (file) {
                formData.append('file', file);
            }
            const res = await createProposalMetadataApi(formData);
            console.log("res", res.data);
            const metadata = res.data.data.metadata;
            setActiveStep(1); // Move to next step

            // Step 2: Approving
            const allowance = await checkAllowanceForCreateProposal();
            console.log("allowance", allowance);
            if (Number.parseFloat(allowance) <= 0) {
                const approveRes = await approveForCreateProposal();
                console.log('approveRes', approveRes);
            }
            setActiveStep(2); // Move to next step

            // Step 3: Creating project
            const createProjectRes = await createProposal(project_id, metadata, grantPrice);
            console.log('createProjectRes', createProjectRes);
            setActiveStep(3); // All steps completed
            setSuccess(true); // Show success modal
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // Automatically navigate to the home page after 3 seconds when success is true
    if (success) {
        setTimeout(() => {
            navigate(`/details/${project_id}`);
        }, 3000);
    }

    return (<Box p={3} maxWidth="600px" mx="auto">
        <Typography variant="h4" gutterBottom>
            Create New Proposal
        </Typography>

        <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            variant="outlined"
        />

        <Box marginTop={2}>
            <InputLabel>Description</InputLabel>
            <ReactQuill
                value={description}
                onChange={setDescription}
                theme="snow"
            />
        </Box>

        <TextField
            fullWidth
            label="Grant Price"
            value={grantPrice}
            onChange={(e) => setGrantPrice(e.target.value)}
            margin="normal"
            disabled={true}
            variant="outlined"
            type="number"
        />

        <Box marginTop={2}>
            <FormControl fullWidth>
                <Input
                    id="upload-file"
                    type="file"
                    onChange={handleFileChange}
                />
            </FormControl>
        </Box>

        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{marginTop: 3}}
        >
            Submit
        </Button>

        <Modal open={loading} onClose={() => {
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
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => (<Step key={index}>
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
                <Typography variant="body1">
                    Your project has been successfully created.
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    Redirecting to the home page...
                </Typography>
            </Box>
        </Modal>
    </Box>);
};

export default CreateProposal;
