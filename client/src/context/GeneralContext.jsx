import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [homeBranch, setHomeBranch] = useState('');

  const inputs = {username, email, usertype, password, homeBranch};


  const navigate = useNavigate();

  const login = async () =>{

    try{

      const loginInputs = {email, usertype, password}
        await axios.post('http://localhost:6001/login', loginInputs)
        .then( async (res)=>{

            console.log(res);
            
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('userType', res.data.usertype);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('balance', res.data.balance);
            localStorage.setItem('IFSC', res.data.ifsc);
            localStorage.setItem('homeBranch', res.data.homeBranch);

            if(res.data.usertype === 'customer'){
                navigate('/home');
            } else if(res.data.usertype === 'admin'){
                navigate('/admin');
            }
        }).catch((err) =>{
            console.log(err);
        });

    }catch(err){
        console.log(err);
    }
  }

  const register = async () =>{

    try{
        await axios.post('http://localhost:6001/register', inputs)
        .then( async (res)=>{
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('userType', res.data.usertype);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('balance', res.data.balance);
            localStorage.setItem('IFSC', res.data.ifsc);
            localStorage.setItem('homeBranch', res.data.homeBranch);

            if(res.data.usertype === 'customer'){
                navigate('/home');
            } else if(res.data.usertype === 'admin'){
                navigate('/admin');
            }

        }).catch((err) =>{
            console.log(err);
        });

    }catch(err){
        console.log(err);
    }
  }



  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
  }



  return (
    <GeneralContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype, homeBranch, setHomeBranch}} >{children}</GeneralContext.Provider>
  )
}

export default GeneralContextProvider
