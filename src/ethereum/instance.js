import DracmaToken from './build/DracmaToken.json';
import provider from './provider';

const ethers = require('ethers');
require('dotenv').config();

export default new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, DracmaToken, provider);
