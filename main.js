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
const fs = require('fs');

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

  const tx5 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 12);
  const tx6 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 19);
  const tx7 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 170);
  const tx8 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 80);

  const tx9 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 9);
  const tx10 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 15);
  const tx11 = new Transaction(peer2.wallet.publicKey, peer1.wallet.publicKey, 74);
  const tx12 = new Transaction(peer1.wallet.publicKey, peer2.wallet.publicKey, 57);

  tx1.signTransaction(peer1.wallet);
  tx2.signTransaction(peer2.wallet);
  tx3.signTransaction(peer2.wallet);
  tx4.signTransaction(peer1.wallet);
  tx5.signTransaction(peer1.wallet);
  tx6.signTransaction(peer2.wallet);
  tx7.signTransaction(peer2.wallet);
  tx8.signTransaction(peer1.wallet);
  tx9.signTransaction(peer1.wallet);
  tx10.signTransaction(peer2.wallet);
  tx11.signTransaction(peer2.wallet);
  tx12.signTransaction(peer1.wallet);

  console.log("Adding transactions to pending transactions...");
  barakCoin.addTransaction(tx1);
  barakCoin.addTransaction(tx2);
  barakCoin.addTransaction(tx3);
  barakCoin.addTransaction(tx4);

  console.log("Mining pending transactions...");
  barakCoin.minePendingTransactions(fullNode.wallet.publicKey);

  barakCoin.addTransaction(tx5);
  barakCoin.addTransaction(tx6);
  barakCoin.addTransaction(tx7);
  barakCoin.addTransaction(tx8);

  console.log("Mining pending transactions...");
  barakCoin.minePendingTransactions(fullNode.wallet.publicKey);

  barakCoin.addTransaction(tx9);
  barakCoin.addTransaction(tx10);
  barakCoin.addTransaction(tx11);
  barakCoin.addTransaction(tx12);

  console.log("Mining pending transactions...");
  barakCoin.minePendingTransactions(fullNode.wallet.publicKey);

  var json = JSON.stringify(barakCoin);
  fs.writeFile('output.json', json, 'utf8', callback);


  for (block of fullNode.blockchain.chain) {
    console.log(block.merkleTree);
  }

  console.log("finished setup");
  callback(this.fullNode, this.peer1, this.peer2);
}

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