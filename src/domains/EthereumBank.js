// @flow
import web3 from '../web3';
import WalletAccount from "./WalletAccount";
import Wallet from "./Wallet";
import logger from '../logger';
import Transaction from "./Transaction";
import TransactionTypes from "../enums/TransactionType";
import WithdrawQueue from "../repositories/WithdrawQueue";

let bank;

class EthereumBank {
    withdrawQueue: WithdrawQueue;
    constructor(queue: WithdrawQueue) {
        this.withdrawQueue = queue;
    }

    static create(): EthereumBank {
        if (!bank) {
            bank = new EthereumBank(WithdrawQueue.create());
        }
        return bank;
    }

    async queueTransaction(to: string, amount: number) {
        await this.withdrawQueue.add(to, amount);
    }

    async processNextTransaction() {
        if (await this.withdrawQueue.isEmpty()) {
            return null;
        }
        const txToBeProcess = await this.withdrawQueue.poll();

        const rootAccount: WalletAccount = Wallet.getInstance().getRoot();
        try {
            web3.eth.sendSignedTransaction(rootAccount.sign({
                from: rootAccount.getAddress(),
                to: txToBeProcess.to,
                value: txToBeProcess.amount,
                gas: 21000,
            }))
            .on('confirmation', (confirmationNumber, receipt) => {
                const ourTx = Transaction.createEthereumTransaction({
                    from: rootAccount.getAddress(),
                    to: txToBeProcess.to,
                    valueInWei: txToBeProcess.amount,
                    type: TransactionTypes.WITHDRAW,
                    transactionHash: receipt.transactionHash,
                    createdTime: new Date(),
                });
                await warehouse.createNewTransaction(ourTx);
            })
            .on('error', async err => {
                logger.error(`[EthereumBank] Send transaction failed ${err}`);
                await withdrawQueue.addBack(...txToBeProcess);
                return null;
            })
        } catch (e) {
            logger.error(`[EthereumBank] Send transaction failed ${e.getMessage()}`);
            await withdrawQueue.addBack(...txToBeProcess);
            return null;
        }
    }
}

export default  EthereumBank;
