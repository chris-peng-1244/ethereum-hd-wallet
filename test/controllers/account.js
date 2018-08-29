const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../../lib/index').default;

describe("/account", () => {
    it("It should create a new account", async() => {
        const res = await chai.request(app)
            .post('/accounts')
            .type('application/json')
            .send({ userId: 1 });
        console.log(res.body);
    });
});
