const ethers = require('ethers');
require('dotenv').config();

const provider = new ethers.providers.InfuraProvider("ropsten", {
    projectId: process.env.REACT_APP_PROJECT_ID
});

export default provider;