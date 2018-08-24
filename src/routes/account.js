// @flow
import express from 'express';

const router = express.Router();

router.post('/', (_, res) => {
    const account = walletRepo.createAccount();
    return res.json({
        address: account.address
    });
});

export default router;