const bip39 = require('bip39');
const chai = require('chai');
chai.should();
const Wallet = require('../../lib/domains/Wallet').default;

describe("Wallet", () => {
    it("It should create a new wallet", () => {
        const mnemonic = bip39.generateMnemonic();
        const wallet = Wallet.getFromMnemonic(mnemonic);
        const account = wallet.getAccount(1);
        account.getAddress().should.be.lengthOf(42);
        account.getAddress().should.match(/^0x/);
    });

    it("It should recover account by index", async() => {
        const mnemonic = bip39.generateMnemonic();
        let wallet = Wallet.getFromMnemonic(mnemonic);
        const account1 = wallet.getAccount(1);
        wallet = Wallet.getFromMnemonic(mnemonic);
        const account1prime = wallet.getAccount(1);
        account1.getAddress().should.equal(account1prime.getAddress());
    });
});