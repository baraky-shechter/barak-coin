class Peer {
  constructor(ip, wallet) {
    this.ip = ip;
    this.wallet = wallet;
  }
}

class FullNode extends Peer {
  constructor(ip, wallet, blockchain) {
    super(ip, wallet);
    this.blockchain = blockchain;
  }
}

class WalletNode extends Peer {
  constructor(ip, wallet, blockHeaders) {
    super(ip, wallet);
    this.blockHeaders = blockHeaders;
  }
}

module.exports.Peer = Peer;
module.exports.FullNode = FullNode;
module.exports.WalletNode = WalletNode;