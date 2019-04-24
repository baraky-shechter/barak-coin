const EC = require('elliptic').ecl

const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log("\n Your public key:\n", publicKey);
console.log("\n Your private key:\n", privateKey);