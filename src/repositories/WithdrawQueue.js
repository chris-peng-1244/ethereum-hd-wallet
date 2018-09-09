// @flow
import redis from '../redis';

const WITHDRAW_QUEUE = 'withdraw_queue';

let queue;

class WithdrawQueue {

    static create(): WithdrawQueue {
        if (!queue) {
            queue = new WithdrawQueue();
        }
        return queue;
    }

    async add(to: string, amount: number) {
        await redis.lpushAsync(WITHDRAW_QUEUE, JSON.stringify({to, amount}));
    }

    async poll(): Promise<{to: string, amount: string}> {
        const data: string = await redis.rpopAsync(WITHDRAW_QUEUE);
        return JSON.parse(data);
    }

    async isEmpty(): Promise<boolean> {
        return await redis.llenAsync(WITHDRAW_QUEUE) === 0;
    }
}

export default WithdrawQueue;
