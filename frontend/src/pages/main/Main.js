import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, Grid, Chip, CircularProgress} from '@mui/material';
import {Box} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {getProjectListApi} from "../../hooks/useAPI";

const Main = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const getProjectList = async () => {
        try {
            const query = {
                page: 1,
                size: 100
            };
            const {data} = await getProjectListApi(query);
            console.log(data.data.items);
            setProjects(data.data.items);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false); // Set loading to false after the API call is completed
        }
    };

    useEffect(() => {
        getProjectList();
    }, []);

    const handleCardClick = (card) => {
        console.log(card);
        navigate(`/details/${card.project_id}`);
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box paddingTop={2} paddingRight={2} paddingLeft={2}>
            {projects.length > 0 ? (
                <Grid container spacing={4}>
                    {projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.project.project_id}>
                            <Card
                                onClick={() => handleCardClick(project.project)}
                                sx={{
                                    cursor: 'pointer', '&:hover': {
                                        boxShadow: 6, // Adds a hover effect for better visual feedback
                                    }
                                }}
                            >
                                <Box
                                    height="300px"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    bgcolor={getRandomColor()}
                                    position="relative" // Make this box relative to contain the status
                                >
                                    <Typography
                                        variant="h1"
                                        color="white"
                                        fontWeight="bold"
                                    >
                                        {project.project.name.charAt(0)}
                                    </Typography>
                                    <Box
                                        position="absolute"
                                        top={8}
                                        right={8}
                                    >
                                        <Chip
                                            label={getStatusLabel(project.project.status)}
                                            color={getStatusColor(project.project.status)}
                                        />
                                    </Box>
                                </Box>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {project.project.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                                dangerouslySetInnerHTML={{__html: project.project.description}}/>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography variant="h6" color="text.secondary">
                        No Cards Available
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Main;
