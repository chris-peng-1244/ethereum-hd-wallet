// @flow
import Transaction from "../domains/Transaction";
import {User as AccountDb, Transaction as TransactionDb, UserBalanceLog as UserBalanceLogDb, sequelize} from '../models';
import TransactionSources from "../enums/TransactionSources";
import logger from '../logger';
import web3 from '../web3';
import {fromWei, toWei} from '../eth-unit';

class Warehouse {

    static create(): Warehouse {
        return new Warehouse();
    }

    async createNewTransaction(transaction: Transaction): Promise<boolean> {
        if (transaction.source === TransactionSources.ETHEREUM
        && transaction.isDeposit()) {
            return await this._createEthereumDepositTransaction(transaction);
        } else if (transaction.source === TransactionSources.ETHEREUM
        && transaction.isWithdraw()) {
            return await this._createEthereumWithdrawTransaction(transaction);
        } else if (transaction.source === TransactionSources.SYSTEM) {
            return await this._createSystemTransaction(transaction);
        } else {
            throw new Error("[Warehouse] Unknown transaction source " + transaction.source);
        }
    }

    async _createSystemTransaction(transaction: Transaction): Promise<boolean> {
        if (await this._transactionAlreadyExists(transaction)) {
            return false;
        }
        const [from, to] = await Promise.all([
            AccountDb.findOne({
                where: {ethereumAddress: transaction.from},
            }),
            AccountDb.findOne({
                where: {ethereumAddress: transaction.to},
            }),
        ]);
        if (!from || !to) return false;
        if (from.balance < transaction.valueInWei) {
            return false;
        }
        try {
            await sequelize.transaction(async t => {
                await TransactionDb.create(transactionModel2Db(transaction), {transaction: t});
                from.balance -= transaction.valueInWei;
                to.balance += transaction.valueInWei;
                await from.save({transaction: t});
                await to.save({transaction: t});
            });
            return true;
        } catch (e) {
            logger.error('[Warehouse] Error ' + e);
            return false;
        }
    }

    async _createEthereumDepositTransaction(transaction: Transaction): Promise<boolean> {
        if (await this._transactionAlreadyExists(transaction)) {
            return false;
        }
        let to = await AccountDb.findOne({
            where: {ethereumAddress: transaction.to},
        });

        if (!to) {
            return false;
        }

        to.balance = toWei(to.balance);
        try {
            await sequelize.transaction(async t => {
                to.balance = fromWei(to.balance + transaction.valueInWei);
                await to.save({transaction: t});
                await TransactionDb.create(transactionModel2Db(transaction), {transaction: t});
                await UserBalanceLogDb.create({
                    userId: to.id, value: fromWei(transaction.valueInWei), type: 'TRANSACTION_DEPOSIT',
                }, { transaction: t });
            });
            return true;
        } catch (e) {
            logger.error('[Warehouse] Error ' + e);
            return false;
        }
    }

    async _createEthereumWithdrawTransaction(transaction: Transaction): Promise<boolean> {
        if (await this._transactionAlreadyExists(transaction)) {
            return false;
        }
        const from = await AccountDb.findOne({
            where: {address: transaction.from},
        });

        if (!from) {
            return false;
        }
        if (from.balance < transaction.valueInWei) {
            return false;
        }
        from.balance = toWei(from.balance);
        try {
            await sequelize.transaction(async t => {
                await TransactionDb.create(transactionModel2Db(transaction), {transaction: t});
                from.balance = fromWei(from.balance - transaction.valueInWei);
                await from.save({transaction: t});
            });
            return true;
        } catch (e) {
            logger.error('[Warehouse] Error ' + e);
            return false;
        }
    }

    async _transactionAlreadyExists(transaction: Transaction): Promise<boolean> {
        const count = await TransactionDb.count({
            where: {transactionHash: transaction.transactionHash}
        });
        return count > 0;
    }
}

function transactionModel2Db(transaction: Transaction): Object {
    return {
        from: transaction.from,
        to: transaction.to,
        value: fromWei(transaction.valueInWei),
        transactionType: transaction.transactionType,
        transactionHash: transaction.transactionHash,
        source: transaction.source,
    };
}
export default Warehouse;
