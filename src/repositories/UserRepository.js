// @flow
import {User} from '../models';

class UserRepository {
    async addBalance(address: string, value: number) {
        const user = await User.find({where:{ethereumAddress: address}});
        if (!user) {
            return;
        }

        user.balance += value;
        return await user.save();
    }
}

export default UserRepository;
