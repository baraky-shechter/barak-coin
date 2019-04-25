var EC = require('elliptic').ec

var ec = new EC('secp256k1');

class Wallet {
  constructor() {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic("hex");
    const privateKey = key.getPrivate("hex");

    this.publicKey = publicKey
    this.privateKey = privateKey

    console.log("\nYour public key:\n", publicKey);
    console.log("\nYour private key:\n", privateKey);
  }
}

module.exports.Wallet = Wallet;