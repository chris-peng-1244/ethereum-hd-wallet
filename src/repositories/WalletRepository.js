// @flow

import WalletAccount from "../domains/WalletAccount";
import Wallet from "../domains/Wallet";
import {User} from '../models';

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
        this._accountDb = User;
    }

    async createAccount(index: number): Promise<WalletAccount> {
        const account = this._wallet.getAccount(index);
        const savedAccount = await this._accountDb.findOne({
            where:{
                id: index,
            }
        });
        if (savedAccount) {
            savedAccount.ethereumAddress = account.getAddress();
            await savedAccount.save();
        }
        return account;
    }

    async findAllByPage(page: number, limit: number): Promise<WalletAccount[]> {
        const data = await this._accountDb.findAll({
            limit,
            offset: (page-1)*limit,
        });
        return data.map(value => {
            return this._wallet.getAccount(value.id);
        });
    }

    async countAll(): Promise<number> {
        return await this._accountDb.count();
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

    async findAccountByUserId(userId: string) {

    }
}

export default WalletRepository;
