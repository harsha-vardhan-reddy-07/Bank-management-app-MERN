import React, { useState } from 'react';
import '../styles/landing.css';
import About1 from '../assets/about1.png';
import About2 from '../assets/about2.png';
import Login from '../components/Login';
import Register from '../components/Register';

const Landing = () => {

    const [isLoginBox, setIsLoginBox] = useState(true);


  return (
    <div className='landingPage'>
        
        <div className="landing-header">
            <span className="landing-header-logo"><img src="" alt="" /></span>
            <ul>
                <li className='header-li'><a href="#home">Home</a></li>
                <li className='header-li'><a href="#about">About</a> </li>
                <li className='header-li'><a href="#home">Join now</a></li>
            </ul>
        </div>


        <div className="landing-body">

            <div className="landing-hero" id='home'>
                <div className="landing-hero-content">
                    <h1>SB Bank</h1>
                    <p>Simplify your financial management with our intuitive banking app, designed to provide seamless access to all your accounts, transactions, and services. </p>

                    <div className="authentication-form">

                        { isLoginBox ?

                            <Login setIsLoginBox={setIsLoginBox} />
                            :
                            <Register setIsLoginBox={setIsLoginBox} />
                        }

                    </div>

                </div>


                <div className="landing-hero-image">
                    
                        <div id='landing-image-sidebar-left'></div>
                        <div className="back"></div>
                        <div id='landing-image-sidebar-right'></div>
                   
                </div>
            </div>

            <div className="landing-about" id='about'>

                <div className="about-1">
                    <img src={About1} className='about-1-img' alt="" />
                    <div className="about-1-content">

                        <h3>Secure Money Deposits & Maturity Assurance</h3>
                        <p>Depositing money has never been more secure and hassle-free. Experience peace of mind knowing that your funds are safeguarded by the highest levels of security. Through our state-of-the-art safety deposit boxes, you can deposit money through our app and enjoy complete control over your financial assets.</p>
                        <a href='#home'>Join now!!</a>

                    </div>
                </div>
                <div className="about-2">
                    <div className="about-2-content">
                        <h3>Elevate Your Financial Aspirations</h3>
                        <p>Unlocking new possibilities and achieving your financial goals. Whether you're planning to start a business, pursue higher education, or renovate your home, LoanLift offers a range of tailored loan solutions to suit your needs. Our user-friendly application process makes securing a loan effortless, and our competitive interest rates ensure affordable repayments.</p>
                        <a href='#home'>Join now!!</a>
                    </div>
                    <img src={About2} className='about-2-img' alt="" />
                </div>

            </div>

            <div className="footer">
                <p>All rights reserved - &#169; SocialeX.com</p>
            </div>


        </div>

    </div>
  )
}

export default Landing