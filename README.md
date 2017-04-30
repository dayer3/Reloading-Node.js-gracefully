# Reloading a server in Node.js

## The problem
Sometimes we could need reload a server without cut off the connections. We can use the "close" call and wait to the established connections, because "close" stops the server from accepting new connections.
But in case we are using WebSockets the "close" call is not enough, becase a WebSocket could not finish in days. So we need a way to be able to detect if a WebSocket is in idle status to kill it and the solution is the [server-shutdown](https://www.npmjs.com/package/server-shutdown) module (@mitmaro).

## This example
This example is based in two different examples:
- [Reloading node with no downtime](http://joseoncode.com/2015/01/18/reloading-node-with-no-downtime/) José F. Romaniello. (@jfromaniello)
- [WebSockets: Cómo utilizar Socket.io en tus aplicaciones web](https://carlosazaustre.es/blog/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/) Carlos Azaustre. (@carlosazaustre)

## Usage
node server/server.js

## Example
1. In a shell launch the master script:
```
$ node server/master.js
[6974] : Started master with 6974
[6980] :     Listeting at http://localhost:8100
[6980] :     A client (wqHAB1KF2Tl0dDrnAAAA) has connected
[...]
[6974] : Reloading...
[7011] :     Listeting at http://localhost:8100
[6974] : Sending SIGHUP signal to my child 6980
[6980] :     SIGHUP signal got. Exit graceluffy.
[6980] :     server end graceluffy.
[7011] :     A client (pYw7AtZHggIaFVu7AAAA) has connected
[...]
[6974] : stopping all...
[6974] : Sending SIGTERM signal to my child 7011
[7011] :     SIGTERM signal got. Exit now.
```
2. In another shell we send the signals:
```
$ kill -SIGHUP 6974
$ kill -SIGTERM 6974
```

