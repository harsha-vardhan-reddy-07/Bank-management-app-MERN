import React, { useEffect, useState } from 'react'
import '../styles/home.css'
import Navbar from '../components/Navbar'
import axios from 'axios';

const Home = () => {


  const username = localStorage.getItem('username');
  const userid = localStorage.getItem('userId');
  const ifsc = localStorage.getItem('IFSC');
  const homeBranch = localStorage.getItem('homeBranch');

  const [balance, setBalance] = useState(0);
  const [sendingAmount, setSendingAmount] = useState(0);
  const [sendingIFSC, setSendingIFSC] = useState();
  const [sendingMethod, setSendingMethod] = useState();
  const [sendingAcId, setSendingAcId] = useState();
  const [sendingRemarks, setSendingRemarks] = useState('');
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

    const sendTransactionData = {senderId: userid, senderName: username, 
                                    receiverId: sendingAcId, remarks: sendingRemarks, receiverIFSC: sendingIFSC, 
                                    amount: sendingAmount, paymentMethod: sendingMethod, time: new Date()};
    if (sendingAmount <= balance){

        await axios.post('http://localhost:6001/send-money', sendTransactionData).then(
          async (response) =>{
            alert("transaction successful");
            setSendingAcId();
            setSendingIFSC();
            setSendingMethod('');
            setSendingAmount(0);
            setSendingRemarks('');
            fetchUserData();
          }
        ).catch((err)=>{
          alert("Transaction failed!!");
        })
      }else{
        alert("No suffecient balance");
      }
  }


  return (
    <>
    <Navbar />
      <div className="home-page">
          <div className="home-user-data">
              <div>
              <p><b>User:</b> {username} </p>
              <p><b>account id:</b> {userid} </p>
              </div>
              <div>
              
              <p><b>IFSC code:</b> {ifsc} </p>
              <p><b>Home Branch:</b> {homeBranch} </p>

              </div>
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
                          
                          <div className="form-floating">
                            <input type="text" className="form-control" id="receiverNameInput"  name="sendingAcId" onChange={(e)=> setSendingAcId(e.target.value)} value={sendingAcId}/>
                            <label htmlFor="receiverNameInput">Receiver's a/c id</label>
                          </div>
                         
                          <div className="form-floating">
                            <input type="text" className="form-control" id="sendingIFSC"  name="sendingAcId"  onChange={(e)=> setSendingIFSC(e.target.value)} value={sendingIFSC}/>
                            <label htmlFor="sendingIFSC">IFSC</label>
                          </div>

                          <div className="form-floating">
                            <input type="number" className="form-control" id="sendAmount" name="sendingAmount" onChange={(e)=> setSendingAmount(e.target.value)} value={sendingAmount}/>
                            <label htmlFor="sendingIFSC">Amount</label>
                          </div>

                          {
                            sendingAmount > 0 && sendingAmount < 200000 ?
                            
                            <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" 
                                                      onChange={(e)=> setSendingMethod(e.target.value)}>
                              <option value="">Choose payment method</option>
                              <option value="IMPS">IMPS</option>
                              <option value="NEFT">NEFT</option>
                            </select>

                            :

                            <>
                            {sendingAmount > 0 && sendingAmount > 200000 ?
                            
                            <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" 
                                                                  onChange={(e)=> setSendingMethod(e.target.value)}>
                              <option value="">Choose payment method</option>
                              <option value="RTGS">RTGS</option>
                              <option value="NEFT">NEFT</option>
                            </select> 
                            :
                            
                            ""}
                            </>
                            
                          }
                          <div className="form-floating">
                            <input type="text" className="form-control" id="sendremarks" name="sendingremarks" onChange={(e)=> setSendingRemarks(e.target.value)} value={sendingRemarks}/>
                            <label htmlFor="sendingremarks">Remarks</label>
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

                                        <>
                                        {transaction.deposit || transaction.loan?
                                          
                                          <div className= {transaction.loanApproved ? "user-transaction money-received" : "user-transaction money-sent"}  key={transaction._id}>
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
                                        <div className=" user-transaction money-sent" key={transaction._id}>
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

                                        
                                    :

                                        
                                        <div className="user-transaction money-received" key={transaction._id}>
                                          {
                                            transaction.loan ?
                                            <>
                                            <span>
                                                <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                                <p><b>Loan type:</b> {transaction.loan}</p>
                                            </span>
                                            <span>
                                                <p><b>Remarks:</b> {transaction.remarks}</p>
                                                <p><b>Time:</b> {transaction.time.slice(4,24)} </p>
                                            </span>
                                          </>
                                              :
                                              <>
                                            <span>
                                                <p><b>Amount: </b>&#8377; {transaction.amount}</p>
                                                <p><b>Sender a/c id:</b> {transaction.senderId}</p>
                                            </span>
                                            <span>
                                                <p><b>Sender:</b> {transaction.senderName}</p>
                                                <p><b>Payment Method:</b> {transaction.paymentMethod} </p>
                                            </span>
                                            <span>
                                                <p><b>IFSC:</b> {transaction.receiverIFSC}</p>
                                                <p><b>Time:</b> {transaction.time} </p>
                                            </span>
                                            <p><b>Remarks:</b> {transaction.remarks} </p>
                                          </>
                                          }
                                          
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