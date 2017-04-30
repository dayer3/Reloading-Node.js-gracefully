'use strict';

var cluster = require('cluster');
const path = require('path');

console.log('[' + process.pid + '] : Started master with ' + process.pid);

cluster.setupMaster({
  exec: path.join(__dirname, 'server.js')
});

//fork the first process
cluster.fork();

process.on('SIGHUP', function () {
  console.log('[' + process.pid + '] : Reloading...');
  var new_worker = cluster.fork();
  new_worker.once('listening', function () {
    //stop all other workersS
    for (var id in cluster.workers) {
      if (id === new_worker.id.toString()) continue;
      console.log('[' + process.pid + '] : Sending SIGHUP signal to my child ' + cluster.workers[id].process.pid);
      cluster.workers[id].process.kill('SIGHUP');
    }
  });
}).on('SIGTERM', function () {
  console.log('[' + process.pid + '] : stopping all... ');
  for (var id in cluster.workers) {
    console.log('[' + process.pid + '] : Sending SIGTERM signal to my child ' + cluster.workers[id].process.pid);
    cluster.workers[id].process.kill('SIGTERM');
  }
});
