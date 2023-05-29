require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const server = http.createServer(app);
const constants = require('./constants/abi');
const { Database } = require('./router/database');
const db = new Database();
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.db = db;

const web3 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:7545`));
const faucetAddress = process.env.faucetAddress;
const faucetContract = new web3.eth.Contract(constants.faucetAbi, faucetAddress);

function equalsDate(date) {
    const existingDate = new Date(date).getTime();

    const nowDate = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).getTime();

    const diff = nowDate - existingDate;
    const hours = diff / (60 * 60 * 1000);

    if(hours >= 24) return true;
    else return false;
};

//출금 
app.post('/withdraw', async (req, res) => {
    try{
        const { db } = req.app.locals;
        const ipAddress = req.headers['x-forwarded-for']||  req.connection.remoteAddress;
        const walletAddress  = req.body.address;
        const faucetDate = new Date();
         
        const dbInsertData = { 
            ip: ipAddress,
            faucet_time: faucetDate,
            wallet_address: walletAddress
        }; 
     
        const privateKey = 'your contract private key';
           
        const lastFaucetDate = JSON.parse(await db.getFaucetDate(ipAddress)).faucet_time;
        const dateValidate = equalsDate(lastFaucetDate);
        
        if(dateValidate){
            if(web3.utils.isAddress(walletAddress)) {
                const dbInsertResult = await db.insertFaucetDate(dbInsertData);
                const amount = web3.utils.toWei('0.1', 'ether');
                const recipient = walletAddress.toString();
                const data = faucetContract.methods.withdraw(amount, recipient).encodeABI();
        
                const tx = {
                    to: faucetAddress,
                    from: walletAddress,
                    data: data,
                    gas: 2000000
                };
                const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        
                const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
                res.send(result);
            } else { 
                res.status(400).send('Invalid Ethereum address');
            };
        }else{  
            res.status(400).send('Last faucet less than 24 hours ago'); 
        }; 
    }catch(err){
        console.error('asasdasd : ',err);
        throw Error('withdraw error- ',err);
    };
});

const port = process.env.PORT || 3333;
server.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
