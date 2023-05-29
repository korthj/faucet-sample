import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import '../css/faucet.css';
import TransactionHashList from './TransactionHashList';

const url = 'http://localhost:3333';

const Faucet = ({ }) => {
    const [address, setAddress] = useState('');
    const [ transactionHash, setTransactionHash ] = useState([]);
    const regacyHashList = useRef(JSON.parse(localStorage.getItem('transactionHash'))||[]);
    
    useEffect(() => {
       setTransactionHash(regacyHashList.current); 
    },[regacyHashList.current]); 

    const handleInputChange = (e) => {
        setAddress(e.target.value);
    };
    const requestEther = async () => {
        try {
            const response = await axios.post(`${url}/withdraw`,{
                address: address
            });
            setTransactionHash([...transactionHash,response.data.transactionHash]);
            localStorage.setItem('transactionHash', JSON.stringify([...transactionHash,response.data.transactionHash]));
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div className="faucet-main">
            <h1 className="faucet-logo-name">FAUCET</h1>

            <div className="faucet-work-area">
                <input
                    className='faucet-input'
                    type="text"
                    value={address}
                    onChange={handleInputChange}
                    placeholder="Enter your GPX address"
                />
                <button className="faucet-button" onClick={requestEther}>Send Me</button>

                <TransactionHashList transactionHash={transactionHash}/>
            </div>   
        </div>
    );
};

export default Faucet;