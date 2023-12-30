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

          {transactions && transactions.map((transaction)=>{
                                
                    return(
                      <>
                          <>
                          {transaction.deposit || transaction.loan?
                            
                            <div className=" user-transaction" key={transaction._id}>
                                <span>
                                    <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                    {transaction.deposit ? <p><b>Deposit name:</b> {transaction.deposit}</p>
                                      : <p><b>Loan name:</b> {transaction.loan}</p>}
                                    
                                </span>
                                <span>
                                    <p><b>Remarks:</b> {transaction.remarks} </p>
                                    <p><b>Time:</b> {transaction.time.slice(4,24)} </p>
                                </span>
                            </div>
                          :
                          <div className=" user-transaction" key={transaction._id}>
                              <span>
                                  <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                  <p><b>Receiver a/c id:</b> {transaction.receiverId}</p>
                              </span>
                              <span>
                                  <p><b>Receiver:</b> {transaction.receiverName} </p>
                                  <p><b>Receiver IFSC:</b> {transaction.receiverIFSC} </p>
                              </span>
                              <span>
                                  <p><b>Payment Method:</b> {transaction.paymentMethod} </p>
                                  <p><b>Time:</b> {transaction.time} </p>
                              </span>
                              <p><b>Remarks:</b> {transaction.remarks} </p>
                          </div>
                          }
                          </>

                          
                      
                      <>
                      {transaction.loan && transaction.senderId ? 
                           <div className=" user-transaction" key={transaction._id}>
                              <span>
                                  <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                  <p><b>Loan name:</b> {transaction.loan}</p>
                                  
                              </span>
                              <span>
                                  <p><b>Remarks:</b> {transaction.remarks} </p>
                                  <p><b>Time:</b> {transaction.time.slice(4,24)} </p>
                              </span>
                            </div>
                      :
                        
                      <></>
                    }
                      </>
                          

                      
                      </>
                    )
                    
                })}
              
              
          </div>
      </div>

    </>
  )
}

export default AllTransactions