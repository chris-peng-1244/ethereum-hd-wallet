// @flow

import WalletAccount from "../domains/WalletAccount";
import Wallet from "../domains/Wallet";
import {Account} from '../models';

let repo;
class WalletRepository {
    _wallet: Wallet;
    _accountDb: Object;
    static create(): WalletRepository {
        if (!repo) {
            repo = new WalletRepository();
        }
        return repo;
    }

    constructor() {
        this._wallet = Wallet.getInstance();
        this._accountDb = Account;
    }

    async createAccount(index: number): Promise<WalletAccount> {
        const account = this._wallet.getAccount(index);
        const savedAccount = await this._accountDb.findOne({
            where:{
                address: account.getAddress(),
            }
        });
        if (!savedAccount) {
            await this._accountDb.create({
                address: account.getAddress(),
                userId: index,
            });
        }
        return account;
    }

    async findAccountByAddress(address: string): Promise<WalletAccount | null> {
        const savedAccount = await this._accountDb.findOne({
            where:{ address }
        });
        if (!savedAccount) {
            return null;
        }
        return Wallet.getInstance().getAccount(savedAccount.userId);
    }
}

export default WalletRepository;
