// @flow

import TransactionTypes from "../enums/TransactionType";
import TransactionSources from "../enums/TransactionSources";
import crc from 'node-crc';

type TransactionData = {
    from: string,
    to: string,
    transactionHash: string,
    valueInWei: number,
    transactionType: string,
    source: string,
    createdTime: Date,
};
class Transaction {
    from: string;
    to: string;
    // 标志每个交易的唯一id
    // 如果来自以太坊，就是对应transaction的hash
    transactionHash: string;
    valueInWei: number;
    // 枚举，转入还是转出
    transactionType: string;
    // 枚举，以太坊还是系统
    source: string;
    createdTime: Date;

    constructor({
            from,
            to,
            transactionHash,
            valueInWei,
            transactionType,
            source,
            createdTime}: TransactionData) {
        this.from = from;
        this.to = to;
        this.transactionHash = transactionHash;
        this.valueInWei = valueInWei;
        this.transactionType = transactionType;
        this.source = source;
        this.createdTime = createdTime;
    }

    static createEthereumTransaction(tx: Object) {
        return new Transaction({
            source: TransactionSources.ETHEREUM,
            createdTime: new Date(),
            ...tx
        });
    }

    static createSystemTransaction(tx: Object) {
        const now = new Date();
        const hash = _hashCode({
            from: tx.from,
            to: tx.to,
            valueInWei: tx.valueInWei,
            transactionType: tx.transactionType,
            createdTime: now.getTime(),
        });
        return new Transaction({
            source: TransactionSources.SYSTEM,
            transactionHash: hash,
            createdTime: now,
            ...tx
        });
    }

    isDeposit(): boolean {
        return this.transactionType === TransactionTypes.DEPOSIT;
    }

    isWithdraw(): boolean {
        return this.transactionType === TransactionTypes.WITHDRAW;
    }
}

function _hashCode(data: Object): string {
    const txString = JSON.stringify({
        from: data.from,
        to: data.to,
        valueInWei: data.valueInWei,
        transactionType: data.transactionType,
        createdTime: data.createdTime,
    });
    const buffer = Buffer.from(txString, 'utf8');
    return crc.crc32(buffer).toString('hex');
}

export default Transaction;
