const topology = require('fully-connected-topology');
const net = require('net');
const {
  stdin,
  exit,
  argv
} = process;
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

const barakCoin = new Blockchain()

const connections1 = {};
const connections2 = {};
const connections3 = {};

setUp(function(fullNode, peer1, peer2) {

  console.log("Setting up P2P network...");
  var t1 = topology('127.0.0.1:4001', ['127.0.0.1:4002', '127.0.0.1:4003']);
  var t2 = topology('127.0.0.1:4002', ['127.0.0.1:4001', '127.0.0.1:4003']);
  var t3 = topology('127.0.0.1:4003', ['127.0.0.1:4001', '127.0.0.1:4002']);


  t1.on('connection', function(connection, peer) {
    console.log('Full node is connected to', peer);
    connections1[peer] = connection

    connection.on('data', data => {
      const dataStrings = data.toString().split(" ");
      console.log(data.toString());
    })
  });

  t2.on('connection', function(connection, peer) {
    console.log('Wallet node 1 is connected to', peer);
    connections2[peer] = connection
    stdin.on('data', data => {
      const coinsToTransfer = data.toString().trim()
      connection.write(peer1.publicKey + " " + coinsToTransfer + " " + this.peer2.publicKey)
    })
  });

  t3.on('connection', function(connection, peer) {
    console.log('Wallet node 2 is connected to', peer);
    connections3[peer] = connection
  });
})


function setUp(callback) {
  console.log('---------------------');
  console.log('Welcome to barak coin');

  console.log('\nCreating wallets and nodes...');
  const fullNode = new FullNode('127.0.0.1:4001', new Wallet(), barakCoin);
  const peer1 = new WalletNode('127.0.0.1:4002', new Wallet(), []);
  const peer2 = new WalletNode('127.0.0.1:4003', new Wallet(), []);


  console.log("Creating and signing transactions.");
  const tx1 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 50);
  const tx2 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 300);
  const tx3 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 47);
  const tx4 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 75);

  tx1.signTransaction(peer1.wallet);
  tx2.signTransaction(peer2.wallet);
  tx3.signTransaction(peer2.wallet);
  tx4.signTransaction(peer1.wallet);

  console.log("Adding transactions to pending transactions...");
  barakCoin.addTransaction(tx1);
  barakCoin.addTransaction(tx2);

  console.log("Mining pending transactions...");
  barakCoin.minePendingTransactions(fullNode.wallet.publicKey);

  console.log(fullNode.blockchain.getBalanceOfAddress(peer2.wallet.publicKey));
  console.log(barakCoin.getBalanceOfAddress(peer1.wallet.publicKey));
  console.log(barakCoin.getBalanceOfAddress(fullNode.wallet.publicKey));
  console.log(fullNode.blockchain);

  for (block of fullNode.blockchain.chain) {
    console.log(block.merkleTree);
  }

  console.log("finished setup");
  callback(this.fullNode, this.peer1, this.peer2);
}



// const peers = {
//   fullNode,
//   peer1,
//   peer2
// };

// console.log(peers);




//
// // console.log(barakCoin.pendingTransactions);
//
// console.log("\n Starting the miner...");

//
// console.log(barakCoin.getBalanceOfAddress(peer2.wallet.publicKey));


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