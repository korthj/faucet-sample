import React, { useState,useEffect } from 'react';
import '../css/transactionHash.css';

const TransactionHashList = (transactionHash) => {
    const transactionHashList = transactionHash.transactionHash.slice(-3).reverse();
    // if(transactionHash.transactionHash.length !== 0 ){
    //     transactionHashList = transactionHash.transactionHash.slice(-3).reverse();
    // };
    return (
        <div className="transaction-hash-list">
            <div className="transaction-hash-list-title">
                Your Transaction Hash:
                </div>
            <div className="transaction-hash-list-print">
                {transactionHashList.map((hash, index) => (
                    <p className="hash-card" key={index}>{hash}</p>
                ))}
            </div>
        </div>
    );
};

export default TransactionHashList;