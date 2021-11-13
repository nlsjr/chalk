import React, { useState, useEffect } from 'react';

import {CssBaseline, Box, Container, Toolbar, Grid, Paper, Button, TextField} from '@mui/material';
import MenuDrawer from './MenuDrawer';
import dracmaToken from '../ethereum/instance';
import CustomSnackbar from './CustomSnackbar';

const ethers = require('ethers');

export default function Quotation() {
    const [open, setOpen] = useState(true);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severitySnackBar, setSeveritySnackBar] = useState('success');
    const [quote, setQuote] = useState('0');
    const title = "Alterar cotação"
    const [signerAddress, setSignerAddress] = useState(null);

    useEffect(async ()  => {

        let quoteValue = '0'
        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            setSignerAddress(await provider.getSigner().getAddress());
            quoteValue = ethers.BigNumber.from(await dracmaToken.quote());
        }

        await fetchData();

        setQuote(quoteValue)
    }, []);

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleCloseSnackBar = () => {
        setOpenSnackBar(!openSnackBar)
    }

    const handleSubmit = e => {
        e.preventDefault();
        updateQuote();
    };

    function updateQuote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();
        
        const newDracmaToken = dracmaToken.connect(signer);

        newDracmaToken.setQuote(quote).then((result) => {
            setOpenSnackBar(true);
            setMessageSnackBar("Transação enviada para alteração de cotação.");
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
                                    id="quote" 
                                    label="Valor do cotação(wei)" 
                                    variant="outlined" 
                                    required
                                    value={quote}
                                    fullWidth
                                    margin="dense"
                                    onChange={e => setQuote(e.target.value)}
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
}