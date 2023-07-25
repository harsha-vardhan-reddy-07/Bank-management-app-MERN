import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/adminDeposits.css'
import axios from 'axios';

const AdminDeposits = () => {

  const [deposits, setDeposits] = useState([]);

  useEffect(()=>{
    fetchDeposits();
  },[]);

  const fetchDeposits = async () =>{
    await axios.get('http://localhost:6001/fetch-deposits').then(
      (response) =>{
        setDeposits(response.data);
      }
    )
  }

  return (
    <>
      <Navbar />

      <div class="deposits">

        <h2>All Deposits</h2>
        <div class="deposits-body">

          {deposits.map((deposit)=>{
            return(

              <div class="deposit" key={deposit._id}>
                  <span>
                      <p><b>Deposit name: </b>{deposit.depositName}</p>
                      <p><b>Amount: </b> {deposit.amount}</p>
                      <p><b>Duration: </b> {deposit.duration} months</p>
                  </span>
                  <span>
                      <p><b>Nominee name: </b> {deposit.nomineeName}</p>
                      <p><b>Customer name: </b> {deposit.customerName}</p>
                      <p><b>Start Date: </b> {deposit.createdDate.slice(0,10)}</p>
                  </span>
                  <span>
                      <p><b>Nominee age: </b> {deposit.nomineeAge}</p>
                      <p><b>Customer A/c id: </b>{deposit.customerId}</p>
                      <p><b>Mature Date: </b> {deposit.matureDate}</p>
                  </span>
              </div>
            )
          })}

        </div>
        </div>

    </>
  )
}

export default AdminDeposits