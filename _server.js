var net = require('net');
const topology = require('fully-connected-topology');
const {
  stdin,
  exit,
  argv
} = process;
const {
  log
} = console;
const {
  me,
  peers
} = extractPeersAndMyPort();
const sockets = {}

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)



var server = net.createServer(function(socket) {
  // confirm socket connection from client
  console.log((new Date()) + '  A client connected to server...');
  socket.on('data', function(data) {
    var string = (data.toString());
    console.log(string)
  });
  // send info to client
  socket.write('Echo from server: NODE.JS Server \r\n');
  socket.pipe(socket);
  socket.end();
  console.log('The client has disconnected...\n');
}).listen(10337);