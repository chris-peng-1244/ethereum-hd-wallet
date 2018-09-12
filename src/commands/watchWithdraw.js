// @flow
import '../config';
import logger from '../logger';
import util from 'util';
import WithdrawQueue from "../repositories/WithdrawQueue";
import EthereumBank from "../domains/EthereumBank";
import Wallet from "../domains/Wallet";
const setTimeoutPromise = util.promisify(setTimeout);
import config from '../config';
import {toWei} from '../eth-unit';
import UserRepository from "../repositories/UserRepository";
import UserBalanceLogRepository from "../repositories/UserBalanceLogRepository";

watch();

function watch() {
    consumeQueue()
        .then(async (consumed) => {
            if (!consumed) {
                logger.info("Idling...");
                await setTimeoutPromise(1000);
            } else {
                logger.info("Queue consumed");
            }
            return watch();
        })
        .catch(err => {
            logger.error('[WatchWithdraw] ' + err.stack);
            return watch();
        });
}

async function consumeQueue() {
    const queue = WithdrawQueue.create();
    if (await queue.isEmpty()) {
        return false;
    }
    const task = await queue.poll();
    const amountInWei = toWei(task.amount);
    if (task.amount <= config.ETHEREUM_WITHDRAW_FEE) {
        await refund(task.to, amountInWei);
        return false;
    }

    const wallet = Wallet.getInstance();
    const bank = EthereumBank.create();
    const balance = await bank.getBalance(wallet.getRoot());
    const gasPrice = await bank.getGasPrice();
    const amount = amountInWei - toWei(config.ETHEREUM_WITHDRAW_FEE);
    if (balance < (amount + gasPrice * 21000)) {
        logger.info('Not enough balance in root ' + wallet.getRoot().getAddress());
        await refund(task.to, amountInWei);
        return false;
    }
    try {
        if (!await EthereumBank.create().transfer(wallet.getRoot(), task.to, amount, gasPrice)) {
            await refund(task.to, amountInWei);
            return false;
        }
        return true;
    } catch (e) {
        await refund(task.to, amountInWei);
        return false;
    }
}

async function refund(address, amount) {
    const userRepo = new UserRepository();
    // set balance
    await userRepo.addBalance(address, amount);
    // add refund transaction
    const balanceLogRepo = new UserBalanceLogRepository();
    await balanceLogRepo.addRefundLog(address, amount);
}

