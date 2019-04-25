const {
  MerkleTree
} = require("merkletreejs")
const SHA256 = require("crypto-js/sha256");

class Block {

  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.merkleTree = this.createMerkleTree();
    this.merkleRoot = this.merkleTree.getRoot().toString('hex');
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp +
      JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("BLOCK MINED: " + this.hash + " " + this.nonce);
  }

  sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
  }

  createMerkleTree() {
    var leaves = [];
    for (var i = 0; i < this.transactions.length; ++i) {
      leaves.push(JSON.stringify(this.transactions[i]));
    }
    const tree = new MerkleTree(leaves, SHA256);
    return tree;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesis() {
    return new Block("01/01/2018", "Genesis Block", "0");
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.createTransaction(rewardTx);
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined.");
    this.chain.push(block);
    this.pendingTransactions = [];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; ++i) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  hash() {
    return sha256(this)
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;