const topology = require('fully-connected-topology');
const net = require('net');
const {
  stdin,
  exit,
  argv
} = process;
// const {
//   me,
//   peers
// } = extractPeersAndMyPort();
const sockets = {};
const {
  Blockchain,
  Block,
  Transaction
} = require('./blockchain.js');
const {
  Wallet
} = require('./wallet.js');
const {
  Peer,
  FullNode,
  WalletNode
} = require('./peer.js')
// const myIp = toLocalIp(me);
// const peersIps = getPeerIps(peers);
const barakCoin = new Blockchain()

console.log('---------------------');
console.log('Welcome to barak coin');
// console.log('My IP: ', myIp)

console.log('\nCreating wallet...');
const myWallet = new Wallet();
console.log("\nYour public key:\n", myWallet.publicKey);
console.log("\nYour private key:\n", myWallet.privateKey);


console.log("\nCreating 2 Wallet nodes...");
const fullNode = new FullNode('127.0.0.1:4000', myWallet, barakCoin);
const peer1 = new WalletNode('127.0.0.2:4000', new Wallet(), []);
const peer2 = new WalletNode('127.0.0.3:4000', new Wallet(), []);

const peers = {
  fullNode,
  peer1,
  peer2
};

console.log(peers);

console.log(barakCoin.getBalanceOfAddress(peer2.wallet.publicKey));

barakCoin.addTransaction(new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 50));

// console.log(barakCoin.pendingTransactions);

console.log("\n Starting the miner...");
barakCoin.minePendingTransactions(fullNode.wallet.publicKey);

console.log(barakCoin.getBalanceOfAddress(peer2.wallet.publicKey));


// topology(myIp, [peer1.ip, peer2.ip]).on('connection', (socket, peerIp) => {
//   const peerPort = extractPortFromIp(peerIp)
//   log('connected to peer - ')
// })

// console.log('\n1\tJoin as Full Node');
// console.log('2\tJoin as Wallet-SPV');
// readline.question('Choose Option: ', (option) => {
//   const message = option.toString().trim();
//   if (message === '1') {
//     console.log("Joining as Full Node...");
//     const barakCoin = new Blockchain();
//     const me = new FullNode(myIp, myWallet, barakCoin);
//     console.log(me);
//   } else if (message === '2') {
//     console.log("Joining as Wallet SPV...");
//     const blockHeaders = [];
//     const me = new WalletNode(myIp, myWallet, blockHeaders);
//     console.log(me);
//   } else {
//     console.log("Input error.");
//     exit(0);
//   }
//   readline.close()
// })

function connectToP2pListServer() {

}

// let barakCoin = new Blockchain();
//


//extract ports from process arguments, {me: first_port, peers: rest... }
// function extractPeersAndMyPort() {
//   return {
//     me: argv[2],
//     peers: argv.slice(3, argv.length)
//   }
// }
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