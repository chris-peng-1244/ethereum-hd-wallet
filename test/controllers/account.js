const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../../lib/index').default;
const {Account, sequelize} = require('../../lib/models');

describe("/account", () => {
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
});
