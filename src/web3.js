import Web3 from 'web3';
import config from './config';

const web3 = new Web3(config.ETHEREUM_PROVIDER);

export default web3;