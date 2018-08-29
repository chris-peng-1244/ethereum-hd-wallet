// @flow
import bip39 from 'bip39';
import HDKey from 'hdkey';
import WalletAccount from "./WalletAccount";
import config from '../config';

let wallet;
class Wallet {
    root: HDKey;
    accounts: { [number]: WalletAccount };

    constructor(mnemonic: string) {
        const seed = bip39.mnemonicToSeed(mnemonic);
        this.root = HDKey.fromMasterSeed(seed);
        this.accounts = {};
    }

    static getInstance(): Wallet {
        if (!wallet) {
            const mnemonic = config.ETHEREUM_WALLET_MNEMONIC;
            if (!mnemonic || !mnemonic.length) {
                throw new  Error("Can't load the mnemonic from configuration");
            }
            wallet = new Wallet(config.ETHEREUM_WALLET_MNENOMIC);
        }
        return wallet;
    }

    static getFromMnemonic(mnemonic: string) {
        return new Wallet(mnemonic);
    }

    getAccount(index: number): WalletAccount {
        if (this.accounts[index]) {
            return this.accounts[index];
        }

        this.accounts[index] = this._createAccount(index);
        return this.accounts[index];
    }

    _createAccount(index: number) {
        const childNode: HDKey = this.root.derive(`m/44'/60'/0'/0/${index}`);
        return new WalletAccount(childNode);
    }
}

export default Wallet;
