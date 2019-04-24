const {
  Blockchain,
  Block,
  Transaction
} = require('./blockchain.js');

let barakCoin = new Blockchain();

barakCoin.createTransaction(new Transaction('address1', 'address2', 100));
barakCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\n Starting the miner...");
barakCoin.minePendingTransactions('address');

console.log("\n Balance of address is: ", barakCoin.getBalanceOfAddress("address"));

console.log("\n Starting the miner again...");
barakCoin.minePendingTransactions("address");

console.log("\n Balance of address is: ", barakCoin.getBalanceOfAddress("address"));