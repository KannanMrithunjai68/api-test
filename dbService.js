const mysql = require('mysql2');
const { Client } = require('ssh2');
const fs = require('fs');

console.log("inside dbsevide.js")

const establishSSHConnection = () => {
    console.log('Establishing SSH connection...'); // Added console log here
    const sshClient = new Client();

    const dbServer = {
        host: 'angularhrms.c0le3olrm9dv.ap-south-1.rds.amazonaws.com',
        port: 3306,
        user: 'admin',
        password: 'FDCadmin',
        database: 'findynamicshrms'
    }

    const tunnelConfig = {
        host: 'ec2-3-110-209-83.ap-south-1.compute.amazonaws.com',
        port: 22,
        username: 'ubuntu',
        privateKey: fs.readFileSync('./Production_Test.pem')
    }

    const forwardConfig = {
        srcHost: '127.0.0.1',
        srcPort: 3306,
        dstHost: dbServer.host,
        dstPort: dbServer.port
    };

    return new Promise((resolve, reject) => {
        sshClient.on('ready', () => {
            console.log('SSH connection is ready.'); // Added console log here
            sshClient.forwardOut(
                forwardConfig.srcHost,
                forwardConfig.srcPort,
                forwardConfig.dstHost,
                forwardConfig.dstPort,
                (err, stream) => {
                    if (err) {
                        console.error('SSH tunnel could not be established:', err);
                        reject(err);
                    } else {
                        console.log('SSH tunnel is established.'); // Added console log here
                        const updatedDbServer = { ...dbServer, stream };
                        const connection = mysql.createConnection(updatedDbServer);
                        connection.connect((error) => {
                            if (error) {
                                console.error('MySQL connection failed:', error);
                                reject(error);
                            } else {
                                console.log('Connected to the MySQL database.'); // Added console log here
                                resolve(connection);
                            }
                        });
                    }
                }
            );
        }).on('error', (err) => {
            console.error('SSH client error:', err);
            reject(err);
        }).connect(tunnelConfig);
    });
};

module.exports = establishSSHConnection;
