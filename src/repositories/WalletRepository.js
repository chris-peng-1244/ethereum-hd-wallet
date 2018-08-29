// @flow

import WalletAccount from "../domains/WalletAccount";
import Wallet from "../domains/Wallet";
import {Account} from '../models';

let repo;
class WalletRepository {
    _wallet: Wallet;
    _walletDb: Object;
    static create(): WalletRepository {
        if (!repo) {
            repo = new WalletRepository();
        }
        return repo;
    }

    constructor() {
        this._wallet = Wallet.getInstance();
        this._walletDb = Account;
    }

    async createAccount(index: number): Promise<WalletAccount> {
        const account = this._wallet.getAccount(index);
        const savedAccount = await this._walletDb.findOne({
            where:{
                address: account.getAddress(),
            }
        });
        if (!savedAccount) {
            await this._walletDb.create({
                address: account.getAddress(),
                userId: index,
            });
        }
        return account;
    }
}

export default WalletRepository;
