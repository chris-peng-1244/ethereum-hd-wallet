// @flow

import express from 'express';
import WalletRepository from '../repositories/WalletRepository';
import WalletAccount from "../domains/WalletAccount";

const walletRepo = WalletRepository.create();

const router = express.Router();

router.post('/', async(req: express$Request, res: express$Response) => {
    const accountIndex: number = parseInt(req.body.userId);
    const account: WalletAccount = await walletRepo.createAccount(accountIndex);
    return res.json({
        address: account.getAddress(),
    });
});

export default router;
