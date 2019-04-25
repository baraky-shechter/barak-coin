class FullNode {
  constructor(ip, wallet, blockchain) {
    this.ip = ip;
    this.wallet = wallet;
    this.blockchain = blockchain;
  }
}

module.exports.FullNode = FullNode;