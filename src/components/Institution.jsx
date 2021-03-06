import React, { useEffect, useState } from 'react';

import {CssBaseline, Box, Container, Toolbar, Grid, Paper} from '@mui/material';

import { TextField, Button } from '@mui/material';
import MenuDrawer from './MenuDrawer';
import dracmaToken from '../ethereum/instance';
import CustomSnackbar from './CustomSnackbar';

const ethers = require('ethers');

export default function Institution () {

    // create state variables for each input
    const [idInstitution, setIdInstitution] = useState('');
    const [address, setAddress] = useState('');
    const [signerAddress, setSignerAddress] = useState(null);
    const [open, setOpen] = useState(true);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severitySnackBar, setSeveritySnackBar] = useState('success');
    const title = "Nova Instituição"

    useEffect(()  => {

        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            setSignerAddress(await provider.getSigner().getAddress());
        }

        fetchData();
    }, []);

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleCloseSnackBar = () => {
        setOpenSnackBar(!openSnackBar)
    }

    const handleSubmit = e => {
        e.preventDefault();
        register(idInstitution, address)
    };

    function register(id, address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();
        
        const newDracmaToken = dracmaToken.connect(signer)
        
        newDracmaToken.registerEducationalInstitution(id, address).then((result) => {
            setOpenSnackBar(true);
            setMessageSnackBar("Transação enviada para o cadastro da instituição.");
            setSeveritySnackBar('info');
        }).catch(error => {
            if(error.error !== undefined) {
                setOpenSnackBar(true);
                setMessageSnackBar(error.error.code + " - " + error.error.message);
                setSeveritySnackBar('error');
            } else {
                setOpenSnackBar(true);
                setMessageSnackBar(error.code + " - " + error.message);
                setSeveritySnackBar('warning');
            }
            
        });
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <CustomSnackbar 
                openSnackbar={openSnackBar} 
                message={messageSnackBar}
                severity={severitySnackBar}
                handleCloseSnackBar={handleCloseSnackBar}
            />
            <MenuDrawer open={open} handleDrawerClose={handleDrawerClose} title={title}/> 
            
            <Box
                component="main"
                sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <form onSubmit={handleSubmit}>
                                    <TextField 
                                        size="small" 
                                        id="idInstitution" 
                                        label="ID" 
                                        variant="outlined" 
                                        required
                                        value={idInstitution}
                                        onChange={e => setIdInstitution(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField 
                                        size="small" 
                                        id="address" 
                                        label="Endereço da carteira" 
                                        variant="outlined"
                                        required
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <div>
                                        <Button sx={{color: 'white', mt: 2}} type="submit" variant="contained" color="primary">Salvar</Button>
                                    </div>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            
        
        </Box>
    );
};