// @flow
import WalletAccount from "./WalletAccount";
import Wallet from "./Wallet";
import EthereumBank from "./EthereumBank";
import logger from '../logger';

class WalletCollector {
    wallet: Wallet;
    bank: EthereumBank;


    constructor(bank: EthereumBank, wallet: Wallet) {
        this.bank = bank;
        this.wallet = wallet;
    }

    async collect(account: WalletAccount) {
        const balance = await this.bank.getBalance(account);
        const gasPrice = await this.bank.getGasPrice();
        const fee = gasPrice * 21000;
        if (fee <= 0) {
            return false;
        }
        if (fee > balance) {
            return false;
        }

        try {
            await this.bank.transfer(account, this.wallet.getRoot(), balance - fee, gasPrice);
            return true;
        } catch (e) {
            logger.error('[WalletCollector] collect failed ' + e.stack);
            return false;
        }
    }
}

export default  WalletCollector;
