const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../../lib/index').default;
const {Account, sequelize} = require('../../lib/models');

describe("/from", () => {
    beforeEach(async() => {
        await sequelize.query('TRUNCATE TABLE accounts');
    });

    it("It should create a new account", async() => {
        const res = await chai.request(app)
            .post('/accounts')
            .type('application/json')
            .send({ userId: 1 });
        res.body.address.length.should.equal(42);
        res.body.address.should.match(/^0x.{40}/);
        const account = await Account.findOne({where:{address: res.body.address}});
        account.userId.should.equal(1);
    });

    it("It should withdraw from an account", async() => {
        const res = await chai.request('app')
            .post('/accounts/withdraw')
            .type('application/json')
            .send({
                amount: 1,
                userId: 1,
                to: '0xa39A0eca01a90e7Bfe2d72AfAc48CCE2d1a66575',
            });
        res.body.transactionHash.should.not.be.null;
        const tx = await Transaction.findOne({
            where: {transactionHash: res.body.transactionHash}
        });
        tx.valueInWei.should.equal(1000000000000000000);
        tx.to.should.equal('0xa39A0eca01a90e7Bfe2d72AfAc48CCE2d1a66575');
    });
});
