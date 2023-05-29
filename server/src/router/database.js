const mysql = require('mysql');

class Database {
    constructor(){
        this.pool = mysql.createPool({
            host: process.env.host,
            port: process.env.port,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            timezone: process.env.timezone
        });

        this.pool.on('error', (err) => {
            console.error('DB Error',err);
        });
    };

    insertFaucetDate(data){
        const pool = this.pool;
        const ip = data.ip;
        const faucet_time = data.faucet_time;
        const wallet_address = data.wallet_address;
        
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO ip_address (ip,faucet_time,wallet_address) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE faucet_time = VALUES(faucet_time)',
            [ip,faucet_time,wallet_address], (err, result) => {
                if(err) {
                    console.log('insertFaucetDate Error :',err);
                    return resolve(null);
                };
                return resolve(JSON.stringify(result));
            });
        });
    };

    getFaucetDate(data){
        const pool = this.pool;
        const ipAddress = data;

        return new Promise((resolve, reject) => {
            pool.query('SELECT faucet_time FROM ip_address WHERE ip=?',
            ipAddress, (err, result) => {
                if(err){
                    console.log('getFaucetDate Error :',err);
                    return resolve('fail');
                };
                return resolve(JSON.stringify(result[0]));
            });
        });
    };

};

module.exports = {
    Database
};