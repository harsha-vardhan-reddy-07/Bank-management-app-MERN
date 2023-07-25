import React, { useEffect, useState } from 'react'
import '../styles/home.css'
import Navbar from '../components/Navbar'
import axios from 'axios';

const Home = () => {


  const username = localStorage.getItem('username');
  const userid = localStorage.getItem('userId');

  const [balance, setBalance] = useState(0);
  const [sendingAmount, setSendingAmount] = useState(0);
  const [sendingAcId, setSendingAcId] = useState();
  const [transactions, setTransactions] = useState([]);


  useEffect(()=>{
    fetchUserData();
  }, [])

  const fetchUserData = async () => {
    console.log(userid);
    try{
        if (userid) {
            await axios.get(`http://localhost:6001/user-details/${userid}`).then(
              async (response) => {
                setBalance(response.data.balance);
                console.log(response);
              }
            ).catch((err)=>{
              console.log(err);
            });
      
            await axios.get(`http://localhost:6001/transactions`).then(
              async (response) => {
                console.log(response);
                setTransactions(response.data.reverse());
              }
            ).catch((err)=>{
              console.log(err);
            });
          }
    }catch(err){
        console.log(err);
    }
  }

  const sendMoney = async () =>{

    const sendTransactionData = {senderId: userid, senderName: username, receiverId: sendingAcId, amount: sendingAmount, time: new Date()};
    
    if (sendingAmount <= balance){

        await axios.post('http://localhost:6001/send-money', sendTransactionData).then(
          async (response) =>{
            alert("transaction successful");
            setSendingAcId();
            setSendingAmount(0);
            fetchUserData();
          }
        )
  
      }else{
        alert("No suffecient balance");
      }
  }


  return (
    <>
    <Navbar />
      <div className="home-page">
          <div className="home-user-data">
              <h3>Helloo {username}!!</h3>
              <p><b>account id:</b> {userid} </p>
          </div>
          <div className="home-body">
              <div className="home-container1">

                  <div className="balance-container">
                      <h4>Account balance</h4>
                      <p>&#8377; {balance}</p>
                  </div>

                  <div className="send-money-container">

                      <form>
                          <h4>Send money</h4>
                          <div className="mb-3">
                            <label htmlFor="sendACId" className="form-label">Receiver's a/c id</label>
                            <input type="text" className="form-control" id="sendACId" placeholder="Enter account id"  name="sendingAcId" onChange={(e)=> setSendingAcId(e.target.value)} value={sendingAcId} />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="sendAmount" className="form-label">Amount</label>
                            <input type="number" className="form-control" id="sendAmount" placeholder="Enter amount" name="sendingAmount" onChange={(e)=> setSendingAmount(e.target.value)} value={sendingAmount} />
                          </div>
                          <button type="submit" className="btn btn-primary" onClick={sendMoney} >Send</button>
                        </form>
          
                  </div>

              </div>

              <div className="home-container2">

                  <div className="user-transactions-container">

                      <h4>Recent Transactions</h4>

                      <div className="user-transactions-body">

                          <div className='user-transactions'>
                            {transactions && transactions.filter(transaction => transaction.senderId === userid ||  transaction.receiverId === userid).map((transaction)=>{
                                
                                return(
                                    <>
                                    {transaction.senderId === userid ?

                                        <div className=" user-transaction money-sent" key={transaction._id}>
                                            <span>
                                                <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                                <p><b>Receiver a/c id:</b> {transaction.receiverId}</p>
                                            </span>
                                            <span>
                                                <p><b>Receiver:</b> {transaction.receiverName} </p>
                                                <p><b>Time:</b> {transaction.time} </p>
                                            </span>
                                        </div>
                                    :
                                        <div className="user-transaction money-received" >
                                            <span>
                                                <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                                <p><b>Sender a/c id:</b> {transaction.senderId}</p>
                                            </span>
                                            <span>
                                                <p><b>Sender:</b> {transaction.senderName}</p>
                                                <p><b>Time:</b> {transaction.time}</p>
                                            </span>
                                        </div>

                                    }
                                    </>
                                )
                                
                            })}
                              
          
                              
                              

                          </div>


                      </div>
                  </div>

              </div>
              
          </div>
      </div> 
    </>

  )
}

export default Home