// @flow
import {User, UserBalanceLog} from '../models';
import TransactionTypes from "../enums/TransactionType";
import {fromWei} from '../eth-unit';

class UserBalanceLogRepository {
    async addRefundLog(address: string, amount: number) {
        const user = await User.find({
            where: {ethereumAddress: address},
        });
        if (!user) {
            return;
        }

        return await UserBalanceLog.create({
            userId: user.id,
            value: fromWei(amount),
            type: TransactionTypes.REFUND,
        });
    }
}

export default UserBalanceLogRepository;
