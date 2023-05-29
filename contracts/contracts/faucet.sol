// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Faucet {
    address public whoDeposited;
    uint public depositAmt;
    uint public accountBalance;
    mapping (address => uint) private balances;

    //payment(payable)를 수신 가능
    function deposit() public payable {
        whoDeposited = msg.sender; //모든 함수 호출은 msg.sender 내포 속성 가짐
        depositAmt = msg.value; //모든 함수는 msg.sender가 보내는 msg.value를 전송할 수 있다.
        accountBalance = address(this).balance;
    }

    function withdraw(uint withdraw_amount, address payable recipient) public {
        recipient.transfer(withdraw_amount);
        balances[recipient] += withdraw_amount;
    }

    function getBalance(address recipient) public view returns (uint) {
        return balances[recipient];
    } 

    receive() external payable {
        // Here you can add code to do something when Ether is deposited to this contract
    }

    fallback() external payable {
        // Here you can add code to do something when Ether is deposited to this contract
    }
}