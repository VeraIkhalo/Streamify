import net from 'net';
const hosts = [
  'ac-jczfjsk-shard-00-00.1lrdour.mongodb.net',
  'ac-jczfjsk-shard-00-01.1lrdour.mongodb.net',
  'ac-jczfjsk-shard-00-02.1lrdour.mongodb.net'
];

hosts.forEach((host) => {
  const socket = new net.Socket();
  socket.setTimeout(5000);
  socket.on('connect', () => {
    console.log(`${host}: reachable`);
    socket.destroy();
  });
  socket.on('timeout', () => {
    console.log(`${host}: timeout`);
    socket.destroy();
  });
  socket.on('error', (err) => {
    console.log(`${host}: error ${err.code || err.message}`);
    socket.destroy();
  });
  socket.connect(27017, host);
});
