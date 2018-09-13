// @flow
import HDKey from 'hdkey';
import web3 from '../web3';
import logger from '../logger';

class WalletAccount {
    account: Object;
    constructor(hdKey: HDKey) {
        this.account = web3.eth.accounts.privateKeyToAccount('0x' + hdKey.privateKey.toString('hex'));
    }

    getAddress(): string {
        return this.account.address;
    }

    async sign(data: Object) {
        try {
            const signedData = await this.account.signTransaction(data);
            return signedData.rawTransaction;
        } catch (e) {
            logger.error('[WalletAccount] sign ' + e.stack);
            return '';
        }
    }
}

export default WalletAccount;
