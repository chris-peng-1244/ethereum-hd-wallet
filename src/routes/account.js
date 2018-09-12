// @flow

import express from 'express';
import WalletRepository from '../repositories/WalletRepository';
import WalletAccount from "../domains/WalletAccount";
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
    const {userId, amount, to} = req.body;
    const account: WalletAccount = await walletRepo.findByUserId(userId);
    if (!account) {
        // TODO better exception handle
        next(boom.badRequest(`No account ${userId}`));
    }

    let transactionHash;
    try {
        await ethBank.queueTransaction(to, amount);
    } catch (e) {
        // TODO better exception handle
        logger.error('[API withdraw] ' + e.getMessage());
        throw e;
    }

    return res.json({
        transactionHash,
    });
});

export default router;
