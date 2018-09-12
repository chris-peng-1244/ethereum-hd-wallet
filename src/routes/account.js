// @flow

import express from 'express';
import WalletRepository from '../repositories/WalletRepository';
import WalletAccount from "../domains/WalletAccount";
import WithdrawQueue from "../repositories/WithdrawQueue";
import logger from '../logger';
import boom from 'boom';

const walletRepo = WalletRepository.create();
const router = express.Router();

router.post('/', async(req: express$Request, res: express$Response) => {
    const accountIndex: number = parseInt(req.body.userId);
    const account: WalletAccount = await walletRepo.createAccount(accountIndex);
    return res.json({
        address: account.getAddress(),
    });
});

router.post('/withdraw', async(req, res, next) => {
    const {amount, to} = req.body;
    let transactionHash;
    try {
        await WithdrawQueue.create().add(to, amount);
    } catch (e) {
        logger.error('[API withdraw] ' + e.getMessage());
        return next(boom.badImplementation('Withdraw failed'));
    }

    return res.json(req.body);
});

export default router;
