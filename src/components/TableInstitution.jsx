import React, { useState, setState, state } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { IconButton, Paper, Typography } from '@mui/material';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

// Generate Order Data
function createData(id, address, balance) {
    return { id, address, balance };
}

const rows = [
    createData(
        '0x64613031343338322d393261632d346334332d383530652d3431363334396438',
        '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        '500'
    ),
    createData(
        '0x65393932356236632d373332372d343237302d396133342d6163643632626165',
        '0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c',
        '454'
    ),
    createData(
        '0x64613031343338322d39326d632d346334332d383530652d3431363334396438',
        '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        '1000'
    ),
    createData(
        '0x64613031343338322d39361632d346334332ed383530652d3431363334396438',
        '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        '999'
    ),
    createData(
        '0x64613031343338322d3932616d2d346334332d383530652d3431363334396438',
        '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        '159'
    )
];

export default function TableInstitution() {
    const [open, setOpen] = useState(false);
    const [institutionInfo, setInstitutionInfo] = useState([])


    const updateInstitutionInfo = (value) => (event) => {
        institutionInfo.id = value.id;
        institutionInfo.balance = value.balance;
        institutionInfo.address = value.address;
        setOpen(!open);
    };

    const toggleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Title>Instituições cadastradas</Title>
            
            <Table size="small">
                <TableHead>
                <TableRow>
                    <TableCell sx={{ fontSize: 12 }}>ID da instituição</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>Endereço público da carteira</TableCell>
                    <TableCell sx={{ fontSize: 12}} align="center">Saldo</TableCell>
                    <TableCell sx={{ fontSize: 12 }} align="center">Transferir</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell sx={{ fontSize: 8}} >{row.id}</TableCell>
                        <TableCell sx={{ fontSize: 8}} >{row.address}</TableCell>
                        <TableCell sx={{ fontSize: 8}} align="center">{row.balance}</TableCell>
                        <TableCell align="center">
                        <IconButton size="small" onClick={updateInstitutionInfo(row)}>
                            <TransferWithinAStationIcon />
                        </IconButton>
                        </TableCell>
                    </TableRow>
                        
                ))}
                </TableBody>
            </Table>
            <Drawer
                anchor='bottom'
                open={open}
                onClose={toggleDrawerClose}>
                <Box sx={{ width: 'auto', height: '230px', mt: 4, ml: 4, mr: 4}} role="presentation">

                    <Grid container spacing={2}>
                        <Grid item xs>
                            <Typography
                                variant="h1"
                                noWrap
                                sx={{fontSize:16, mb: 4}}
                                >
                                Transferência de tokens
                            </Typography>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{fontSize:14}}
                                    >
                                    ID instituição
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    noWrap
                                    sx={{fontSize:12}}
                                    >
                                    {institutionInfo.id}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{fontSize:14, mt: 4}}
                                    >
                                    Endereço da Wallet
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    noWrap
                                    sx={{fontSize:12}}
                                    >
                                    {institutionInfo.address}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{fontSize:14, mt: 4}}
                                    >
                                    Saldo: {institutionInfo.balance} tokens
                                </Typography>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{fontSize:12}}
                                    >
                                    Transferir para
                                </Typography>
                                <TextField 
                                    size="small" 
                                    id="addressStudent" 
                                    label="Wallet do Aluno" 
                                    variant="outlined" 
                                    required
                                    margin="dense"
                                />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{fontSize:12}}
                                    >
                                    A quantidade de tokens
                                </Typography>
                                <TextField 
                                    size="small" 
                                    id="amountStudent" 
                                    label="Quantidade Tokens" 
                                    variant="outlined" 
                                    required
                                    margin="dense"
                                />
                                <Button sx={{color: 'white', mt: 2}} type="submit" variant="contained" color="primary">Transferir</Button>
                            </Paper>
                        </Grid>
                        
                    </Grid>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}