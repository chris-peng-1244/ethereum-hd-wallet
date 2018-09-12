// @flow
import web3 from '../web3';
import WalletAccount from "./WalletAccount";
import Wallet from "./Wallet";
import logger from '../logger';
import Transaction from "./Transaction";
import TransactionTypes from "../enums/TransactionType";
import WithdrawQueue from "../repositories/WithdrawQueue";
import {fromWei} from '../eth-unit';

let bank;

class EthereumBank {
    // withdrawQueue: WithdrawQueue;
    // constructor(queue: WithdrawQueue) {
    //     this.withdrawQueue = queue;
    // }
    //
    static create(): EthereumBank {
        if (!bank) {
            bank = new EthereumBank();
        }
        return bank;
    }

    async getBalance(account: WalletAccount): Promise<number> {
        try {
            return await web3.eth.getBalance(account.getAddress());
        } catch (e) {
            return 0;
        }
    }

    async getGasPrice(): Promise<number> {
        try {
            return await web3.eth.getGasPrice();
        } catch (e) {
            return -1;
        }
    }

    async transfer(from: WalletAccount, to: WalletAccount, amount: number, gasPrice: number = 0) {
        if (gasPrice <= 0) {
            gasPrice = await this.getGasPrice();
        }
            const signedTx = await from.sign({
                to: to.getAddress(),
                value: String(amount),
                gas: 21000,
                gasPrice: parseInt(gasPrice),
            });
            if (!signedTx) {
                return false;
            }
            return new Promise(resolve => {
                web3.eth.sendSignedTransaction(signedTx)
                    .on('receipt', async (receipt) => {
                        logger.info('[EthereumBank] transfer done with ' + receipt.transactionHash);
                        resolve(true);
                    })
                    .on('error', async err => {
                        logger.error(`[EthereumBank] Send transaction failed ${err}`);
                        resolve(false);
                    })
            });
    }

    // async queueTransaction(to: string, amount: number) {
    //     await this.withdrawQueue.add(to, amount);
    // }
    //
    // async processNextTransaction() {
    //     if (await this.withdrawQueue.isEmpty()) {
    //         return null;
    //     }
    //     const txToBeProcess = await this.withdrawQueue.poll();
    //
    //     const rootAccount: WalletAccount = Wallet.getInstance().getRoot();
    //     try {
    //         web3.eth.sendSignedTransaction(rootAccount.sign({
    //             from: rootAccount.getAddress(),
    //             to: txToBeProcess.to,
    //             value: txToBeProcess.amount,
    //             gas: 21000,
    //         }))
    //         .on('confirmation', async (confirmationNumber, receipt) => {
    //             const ourTx = Transaction.createEthereumTransaction({
    //                 from: rootAccount.getAddress(),
    //                 to: txToBeProcess.to,
    //                 valueInWei: txToBeProcess.amount,
    //                 type: TransactionTypes.WITHDRAW,
    //                 transactionHash: receipt.transactionHash,
    //                 createdTime: new Date(),
    //             });
    //             await warehouse.createNewTransaction(ourTx);
    //         })
    //         .on('error', async err => {
    //             logger.error(`[EthereumBank] Send transaction failed ${err}`);
    //             await withdrawQueue.addBack(...txToBeProcess);
    //             return null;
    //         })
    //     } catch (e) {
    //         logger.error(`[EthereumBank] Send transaction failed ${e.getMessage()}`);
    //         await withdrawQueue.addBack(...txToBeProcess);
    //         return null;
    //     }
    // }
}

export default  EthereumBank;
