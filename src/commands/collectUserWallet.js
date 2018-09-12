// @flow
import '../config';
import logger from '../logger';
import config from '../config';
import bluebird from 'bluebird';
import WalletRepository from "../repositories/WalletRepository";
import WalletAccount from "../domains/WalletAccount";
import WalletCollector from "../domains/WalletCollector";
import EthereumBank from "../domains/EthereumBank";
import Wallet from "../domains/Wallet";

const walletRepo = WalletRepository.create();
const collector = new WalletCollector(EthereumBank.create(), Wallet.getInstance());
collect()
    .then(() => {
        logger.info('User wallets collected');
        process.exit(0);
    })
    .catch(err => {
        logger.error('User wallets collecting failed ' + err.stack);
        process.exit(1);
    });

async function collect() {
    const total = await walletRepo.countAll();
    const limit = config.ETHEREUM_WALLET_COLLECT_LIMIT;
    if (total === 0) {
        return;
    }

    const page = Math.ceil(total / limit);

    for (let i = 1; i <= page; i++) {
        const accounts = await walletRepo.findAllByPage(i, limit);
        await bluebird.map(accounts, async(account: WalletAccount) => {
            logger.info(`Collecting ${account.getAddress()}`);
            try {
                await collector.collect(account);
            } catch (e) {
                logger.error(`Collect wallet ${account.getAddress()} failed ` + e.stack);
            }
        })
    }
}
