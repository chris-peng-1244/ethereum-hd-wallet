// @flow
import '../config';
import web3 from '../web3';
import redis from '../redis';
import logger from '../logger';
import Transaction from "../domains/Transaction";
import Warehouse from "../repositories/Warehouse";
import TransactionTypes from "../enums/TransactionType";
import bluebird from 'bluebird';
import util from 'util';
const setTimeoutPromise = util.promisify(setTimeout);

const LAST_BLOCK_NUMBER = 'last_block_number';

logger.debug("Start watching ethereum blockchain...");

watch();

function watch() {
    return scanNewBlock()
    .then(newBlock => {
        if (newBlock < 0) {
            logger.debug("Idling...");
            return setTimeoutPromise(1000);
        }
    })
    .then(() => {
        return watch();
    })
}

async function scanNewBlock() {
    let blockNumber;
    try {
        blockNumber = await getNextUnscannedBlock();
    } catch (e) {
        logger.error(e.getMessage());
        return -1;
    }

    if (blockNumber >= 0) {
        let block;
        try {
            block = await web3.eth.getBlock(blockNumber);
        } catch (e) {
            logger.error(e.getMessage());
            return -1;
        }

        logger.debug(`Scanning through block ${block.hash}`);
        try {
            await bluebird.map(block.transactions, async (txHash) => {
                await findNewDeposit(txHash);
            });
        } catch (e) {
            logger.error(e.getMessage());
            return -1;
        }

        await incrScannedBlock(blockNumber);
        return blockNumber;
    }
    return -1;
}

async function getNextUnscannedBlock() {
    let [lastBlockNumber, currentBlockNumber] = await Promise.all([
        redis.getAsync(LAST_BLOCK_NUMBER),
        web3.eth.getBlockNumber(),
    ]);

    lastBlockNumber = parseInt(lastBlockNumber);
    if (isNaN(lastBlockNumber)) {
        return currentBlockNumber > 100 ? currentBlockNumber - 100 : 0;
    } else {
        if (lastBlockNumber >= currentBlockNumber) {
            return -1;
        }

        if (lastBlockNumber < 0) {
            return -1;
        }

        return lastBlockNumber + 1;
    }
}

async function incrScannedBlock(blockNumber: number) {
    await redis.setAsync(LAST_BLOCK_NUMBER, blockNumber);
}

const warehouse = Warehouse.create();
async function findNewDeposit(txHash) {
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
        return;
    }
    tx.value = parseInt(tx.value, 10);
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
