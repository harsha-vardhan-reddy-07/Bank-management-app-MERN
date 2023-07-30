import React, { useContext } from 'react'
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {

    const navigate = useNavigate();
    const usertype = localStorage.getItem('userType');

    const {logout} = useContext(GeneralContext);

  return (
    <>
        <div className="navbar">

        {usertype === 'customer' ? 
        
        <>
            <h3 >SB Bank</h3>

            <div className="nav-options" >

                <p onClick={()=>navigate('/home')}>Home</p>
                <p onClick={()=>navigate('/deposits')}>Deposits</p>
                <p onClick={()=>navigate('/loans')}>Loans</p>
                <p onClick={()=>navigate('/transactions')}>Transactions</p>
                <p onClick={logout}>Logout</p>

            </div>
        </>
            :  usertype === 'admin' ?

                    <>
                        <h3 >SB Bank (Admin)</h3>
                        <div className="nav-options" >

                            <p onClick={()=>navigate('/admin')}>Home</p>
                            <p onClick={()=>navigate('/all-users')}>Users</p>
                            <p onClick={()=>navigate('/all-deposits')}>Deposits</p>
                            <p onClick={()=>navigate('/all-loans')}>Loans</p>
                            <p onClick={()=>navigate('/all-transactions')}>Transactions</p>
                            <p onClick={logout}>Logout</p>
                        </div> 
                    </>
            
                :

                    ""

        }



            

        </div>
    
    </>
  )
}

export default Navbar