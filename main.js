const topology = require('fully-connected-topology');

const {
  stdin,
  exit,
  argv
} = process;

const {
  me,
  peers
} = extractPeersAndMyPort();
const sockets = {};

const {
  Blockchain,
  Block,
  Transaction
} = require('./blockchain.js');

const {
  Wallet
} = require('./wallet.js');

const myIp = toLocalIp(me);
const peersIps = getPeerIps(peers);

console.log('---------------------');
console.log('Welcome to barak coin');
console.log('My IP: ', myIp)

console.log('\n1\tJoin as full node');
console.log('2\tJoin as wallet');
// stdin.on('Choose option: ', data => {
//   const option = data.toString().trim();
//   if (message === '1') {
//     console.log("Joining as full node...");
//   } else if (message === '2') {
//     console.log("Joining as wallet...");
//   } else {
//     console.log("Input error.");
//     exit(0);
//   }
// })
console.log('\nCreating wallet...');
new Wallet();

// let barakCoin = new Blockchain();
//
// barakCoin.createTransaction(new Transaction('address1', 'address2', 100));
// barakCoin.createTransaction(new Transaction('address2', 'address1', 50));
//
// // console.log(barakCoin.pendingTransactions);
//
// console.log("\n Starting the miner...");
// barakCoin.minePendingTransactions('address');
//
// console.log("\n Balance of address is: ", barakCoin.getBalanceOfAddress("address"));
//
// console.log("\n Starting the miner again...");
// barakCoin.minePendingTransactions("address");
//
// console.log("\n Balance of address is: ", barakCoin.getBalanceOfAddress("address"));

//extract ports from process arguments, {me: first_port, peers: rest... }
function extractPeersAndMyPort() {
  return {
    me: argv[2],
    peers: argv.slice(3, argv.length)
  }
}
//'4000' -> '127.0.0.1:4000'
function toLocalIp(port) {
  return '127.0.0.1:' + port
}
//['4000', '4001'] -> ['127.0.0.1:4000', '127.0.0.1:4001']
function getPeerIps(peers) {
  return peers.map(peer => toLocalIp(peer))
}
//'hello' -> 'myPort:hello'
function formatMessage(message) {
  return me + '>' + message
}
//'127.0.0.1:4000' -> '4000'
function extractPortFromIp(peer) {
  return peer.toString().slice(peer.length - 4, peer.length);
}
//'4000>hello' -> '4000'
function extractReceiverPeer(message) {
  return message.slice(0, 4);
}
//'4000>hello' -> 'hello'
function extractMessageToSpecificPeer(message) {
  return message.slice(5, message.length);
}