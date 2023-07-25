import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Admin = () => {

  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [depositsCount, setDepositsCount] = useState(0);
  const [loansCount, setLoansCount] = useState(0);


  useEffect(()=>{

    fetchData();
  }, [])

  const fetchData = async () =>{
    await axios.get('http://localhost:6001/fetch-users').then(
      (response)=>{
        
        setUserCount(response.data.length);
        
      }
    );
    await axios.get('http://localhost:6001/transactions').then(
      (response)=>{
        setTransactionCount(response.data.length);
      }
    );
    await axios.get('http://localhost:6001/fetch-deposits').then(
      (response)=>{
        setDepositsCount(response.data.length);
      }
    );
    await axios.get('http://localhost:6001/fetch-loans').then(
      (response)=>{
        setLoansCount(response.data.length);
      }
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-page">

        <div className="card admin-card users-card">
            <h4>Users</h4>
            <p> {userCount} </p>
            <button className="btn btn-primary" onClick={()=>navigate('/all-users')}>View all</button>
        </div>

        <div className="card admin-card transactions-card">
            <h4>Transactions</h4>
            <p> {transactionCount} </p>
            <button className="btn btn-primary" onClick={()=>navigate('/all-transactions')}>View all</button>
        </div>

        <div className="card admin-card deposits-card">
            <h4>Deposits</h4>
            <p> {depositsCount} </p>
            <button className="btn btn-primary" onClick={()=>navigate('/all-deposits')}>View all</button>
        </div>

        <div className="card admin-card loans-card">
            <h4>Loans</h4>
            <p> {loansCount} </p>
            <button className="btn btn-primary" onClick={()=>navigate('/all-loans')}>View all</button>
        </div>

    </div>
    
    </>
  )
}

export default Admin