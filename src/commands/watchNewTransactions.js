// @flow
import config from '../config';
import web3 from '../web3';
import redis from '../redis';
import logger from '../logger';
import Transaction from "../domains/Transaction";
import Warehouse from "../repositories/Warehouse";
import TransactionTypes from "../enums/TransactionType";
import bluebird from 'bluebird';
const setTimeoutPromise = bluebird.promisify(setTimeout);

const LAST_BLOCK_NUMBER = 'last_block_number';

logger.debug("Start watching ethereum blockchain...");


watch().then();

async function watch() {
    while (true) {
        const newBlock = await scanNewBlock();
        if (newBlock < 0) {
            await setTimeoutPromise('Slept for a while...', 1000);
        }
    }
}

async function scanNewBlock() {
    const blockNumber = await getNextUnscannedBlock();
    if (blockNumber >= 0) {
        const block = await web3.eth.getBlock(blockNumber);
        logger.debug(`Scanning through block ${block.hash}`);
        await bluebird.map(block.transactions, async(txHash) => {
            await findNewDeposit(txHash);
        });
        await incrScannedBlock(blockNumber);
        return blockNumber;
    }
    return -1;
}

async function getNextUnscannedBlock() {
    const [lastBlockNumber, currentBlockNumber] = await Promise.all([
        redis.getAsync(LAST_BLOCK_NUMBER),
        web3.eth.getBlockNumber(),
    ]);
    if (lastBlockNumber >= currentBlockNumber) {
        return -1;
    }

    if (lastBlockNumber >= 0) {
        return lastBlockNumber+1;
    }

    return currentBlockNumber > 100 ? currentBlockNumber - 100 : 0;
}

async function incrScannedBlock(blockNumber) {
    await redis.setAsync(LAST_BLOCK_NUMBER, blockNumber);
}

const warehouse = Warehouse.create();
async function findNewDeposit(txHash) {
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
        return;
    }
    if (tx.value === 0) {
        return;
    }

    const ourTx = Transaction.createEthereumTransaction({
        from: tx.from,
        to: tx.to,
        valueInWei: tx.value,
        transactionType: TransactionTypes.DEPOSIT,
        transactionHash: tx.hash,
    });
    await warehouse.createNewTransaction(ourTx);
}
