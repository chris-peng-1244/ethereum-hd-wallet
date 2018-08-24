// @flow
import HDKey from 'hdkey';
import web3 from '../web3';

class WalletAccount {
    account: Object;
    constructor(hdKey: HDKey) {
        this.account = web3.eth.accounts.privateKeyToAccount(hdKey.privateKey);
    }

    getAddress(): string {
        return this.account.address;
    }
}

export default WalletAccount;