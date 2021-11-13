import React, { useState, useEffect } from 'react';
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
// import web3Provider from '../web3Provider';
import dracmaToken from '../ethereum/instance';
import institutionJson from '../mock/institutions.json';
import CustomSnackbar from './CustomSnackbar';

const ethers = require('ethers');


export default function TableInstitution() {
    const [open, setOpen] = useState(false);
    const [institutionInfo, setInstitutionInfo] = useState({});
    const [listInstituionInfo, setListInstituionInfo] = useState([]);
    const [signerAddress, setSignerAddress] = useState(null);
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severitySnackBar, setSeveritySnackBar] = useState('success');

    
    useEffect(async ()  => {
        function fetchData() {

            institutionJson.map(async inst => {
                const id = inst
                const address = await dracmaToken.institutionsId(id);
                const balance = await dracmaToken.balanceOf(address);

                let instInfo = {id, address, balance: ethers.BigNumber.from(balance).toString()}

                setListInstituionInfo((state) => ([...state, instInfo]))
            })
        }

        await fetchData();
    }, []);

    const updateInstitutionInfo = (value) => (event) => {
        newProvider();
        institutionInfo.id = value.id;
        institutionInfo.balance = value.balance;
        institutionInfo.address = value.address;
        setOpen(!open);
    };

    async function newProvider() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        setSignerAddress(await provider.getSigner().getAddress());
    }

    async function transfer() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();

        const address = await provider.getSigner().getAddress();
        
        if(address !== institutionInfo.address) {
            setOpenSnackBar(true);
            setMessageSnackBar(`Você deve selecionar o address ${address} no Metamask`);
            setSeveritySnackBar('error');
            return;
        }

        const newDracmaToken = dracmaToken.connect(signer);

        newDracmaToken.transfer(recipient, amount).then((result) => {
            setOpenSnackBar(true);
            setMessageSnackBar("Transação para a compra dos tokens enviada.");
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

    const toggleDrawerClose = () => {
        setOpen(false);
    };

    const handleCloseSnackBar = () => {
        setOpenSnackBar(!openSnackBar)
    }

    const handleSubmit = e => {
        e.preventDefault();
        transfer();
    };

    return (
        <React.Fragment>
            <Title>Instituições cadastradas</Title>
            <CustomSnackbar 
                openSnackbar={openSnackBar} 
                message={messageSnackBar}
                severity={severitySnackBar}
                handleCloseSnackBar={handleCloseSnackBar}
            />
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
                    {listInstituionInfo.map((instInfo, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ fontSize: 8}} >{instInfo.id}</TableCell>
                            <TableCell sx={{ fontSize: 8}} >{instInfo.address}</TableCell>
                            <TableCell sx={{ fontSize: 8}} align="center">{instInfo.balance}</TableCell>
                            <TableCell align="center">
                            <IconButton size="small" onClick={updateInstitutionInfo(instInfo)}>
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
                                <form onSubmit={handleSubmit}>
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
                                        fullWidth
                                        margin="dense"
                                        onChange={e => setRecipient(e.target.value)}
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
                                        fullWidth
                                        margin="dense"
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                    <Button sx={{color: 'white', mt: 2}} type="submit" variant="contained" color="primary">Transferir</Button>
                                </form>
                            </Paper>
                        </Grid>
                        
                    </Grid>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}