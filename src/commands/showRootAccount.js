import '../config';
import Wallet from "../domains/Wallet";

const wallet = Wallet.getInstance();

console.log(`Public key ${wallet.getRoot().getAddress()}`);
console.log(`Private key ${wallet.getRoot().getPrivateKey()}`);
