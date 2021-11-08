import React, { useState } from 'react';

import {CssBaseline, Box, Container, Toolbar, Grid, Paper, Button, TextField} from '@mui/material';
import MenuDrawer from './MenuDrawer';

export default function BuyTokens() {
    const [open, setOpen] = useState(true);
    const [amount, setAmount] = useState('');
    const title = "Comprar Tokens"

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(amount);
        
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
                                    id="amount" 
                                    label="Quantidade Tokens" 
                                    variant="outlined" 
                                    required
                                    value={amount}
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