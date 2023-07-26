import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/allTransactions.css'
import axios from 'axios';

const AllTransactions = () => {

  const [transactions, setTransactions] = useState([]);

  useEffect(()=>{
    fetchDeposits();
  },[]);

  const fetchDeposits = async () =>{
    await axios.get('http://localhost:6001/transactions').then(
      (response) =>{
        setTransactions(response.data.reverse());
      }
    )
  }

  return (
    <>
      <Navbar />

      <div class="all-transactions-page">

          <h2>All Transactions</h2>

          <div class="transactions-body">

            {transactions.map((transaction) =>{
              return(
                <div class="transaction" key={transaction._id}>
                    <span>
                        <p><b>Amount:</b> {transaction.amount} </p>
                        <p><b>Receiver:</b> {transaction.receiverName} </p>
                        <p><b>Receiver's a/c id:</b> {transaction.receiverId} </p>
                        <p><b>Receiver IFSC:</b> {transaction.receiverIFSC} </p>
                    </span>
                    <span>
                        <p><b>Sender:</b> {transaction.senderName} </p>
                        <p><b>Sender's a/c id:</b> {transaction.senderId} </p>
                        <p><b>Payment method:</b> {transaction.paymentMethod} </p>
                        <p><b>Time:</b> {transaction.time} </p>
                    </span>
                </div>
              )
            })}

              
              
          </div>
      </div>

    </>
  )
}

export default AllTransactions