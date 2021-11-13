import React, { useState, useEffect } from 'react';

import {CssBaseline, Box, Container, Toolbar, Grid, Paper, Button, TextField} from '@mui/material';
import MenuDrawer from './MenuDrawer';
import CustomSnackbar from './CustomSnackbar';
import dracmaToken from '../ethereum/instance';

const ethers = require('ethers');

export default function BuyTokens() {
    const [open, setOpen] = useState(true);
    const [amount, setAmount] = useState('');
    const [idInstitution, setIdInstitution] = useState('');

    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severitySnackBar, setSeveritySnackBar] = useState('success');
    const title = "Comprar Tokens"

    const [signerAddress, setSignerAddress] = useState(null);

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
        buy();
    };

    async function buy() {
        const quotation = await dracmaToken.quote();

        let overrides = {
            value: ethers.BigNumber.from(amount) * ethers.BigNumber.from(quotation)
        };

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();
        
        const newDracmaToken = dracmaToken.connect(signer);

        newDracmaToken.buy(amount, idInstitution, overrides).then((result) => {
            setOpenSnackBar(true);
            setMessageSnackBar("Transação enviada para a compra de tokens.");
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
                                    label="ID da instituição" 
                                    variant="outlined" 
                                    required
                                    value={idInstitution}
                                    fullWidth
                                    margin="dense"
                                    onChange={e => setIdInstitution(e.target.value)}
                                />

                                <TextField 
                                    size="small" 
                                    id="amount" 
                                    label="Quantidade Tokens" 
                                    variant="outlined" 
                                    required
                                    value={amount}
                                    fullWidth
                                    margin="dense"
                                    onChange={e => setAmount(e.target.value)}
                                />

                                <div>
                                    <Button sx={{color: 'white', mt: 2}} type="submit" variant="contained" color="primary">Comprar</Button>
                                </div>
                            </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}