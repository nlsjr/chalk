import React, { useState } from 'react';

import {CssBaseline, Box, Container, Toolbar, Grid, Paper} from '@mui/material';

import { TextField, Button } from '@mui/material';
import MenuDrawer from './MenuDrawer';

export default function Institution () {

    // create state variables for each input
    const [idInstitution, setIdInstitution] = useState('');
    const [address, setAddress] = useState('');

    const [open, setOpen] = useState(true);
    const title = "Nova Instituição"

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(idInstitution, address);
        
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
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