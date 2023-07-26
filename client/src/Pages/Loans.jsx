import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/loans.css'
import axios from 'axios';

const Loans = () => {

    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userId');

    const [newLoanType, setNewLoanType] = useState('');
    const [newNomineeName, setNewNomineeName] = useState('');
    const [newNomineeAge, setNewNomineeAge] = useState(0);
    const [newLoanAmount, setNewLoanAmount] = useState(0);
    const [newLoanDuration, setNewLoanDuration] = useState(0);

    const [paymentLoanId, setPaymentLoanId] = useState();
    const [paymentLoanAmount, setPaymentLoanAmount] = useState(0);

    const [loans, setLoans] = useState([]);

    useEffect(()=>{
        fetchLoansData();
      }, [])
    
      const fetchLoansData = async () => {
        try{
            if (userid) {
                await axios.get(`http://localhost:6001/fetch-loans`).then(
                  async (response) => {
                    console.log(response);
                    setLoans(response.data.reverse());
                  }
                ).catch((err)=>{
                  console.log(err);
                });
              }
        }catch(err){
            console.log(err);
        }
      }

      const createNewLoan = async () =>{

        const newLoanDetails = {loanType: newLoanType, customerId: userid, customerName: username, 
                                  nomineeName: newNomineeName, nomineeAge: newNomineeAge, duration: newLoanDuration, 
                                  loanAmount: newLoanAmount, createdDate: new Date()};
        await axios.post('http://localhost:6001/new-loan', newLoanDetails).then(
            async (response) =>{
                console.log(response);
                alert("new Loan created");
                setNewLoanType('');
                setNewNomineeName('');
                setNewNomineeAge(0);
                setNewLoanAmount(0);
                setNewLoanDuration(0);

                fetchLoansData();
            }
        ).catch((err)=>{
            console.log(err);
        })
      }


      const makePayment = async (id) => {
        const paymentData = { id, amount: paymentLoanAmount };
        await axios.post('http://localhost:6001/repay-loan', paymentData).then(
          (response) => {
            alert("loan payment successful");
            setPaymentLoanAmount(0);
            fetchLoansData();
          }
        );
      };
      


  return (
    <>
      <Navbar />


      <div className="user-loans-page">
      
          <div className="user-loans-container1">

              <div className="user-loans">

                  <h3>Loans</h3>
                  <div className="user-loans-body">

                     {loans && loans.filter(loan => loan.customerId === userid).map((loan)=>{
                        return(
                            <div className="user-loan" key={loan._id}>
                              <span>
                                  <p><b>Loan type: </b>{loan.loanType}</p>
                                  <p><b>Nominee name: </b> {loan.nomineeName}</p>
                                  <p><b>Loan amount: </b> {loan.loanAmount}</p>
                              </span>
                              <span>
                                  <p><b>Balance: </b> {loan.balance}</p>
                                  <p><b>Duration: </b> {loan.duration} months</p>
                                  {loan.loanStatus === 'pending' || loan.loanStatus === 'declined'  ? 
                                    <p ><b>Loan status: </b>{loan.loanStatus}</p>
                                  :
                                    <p ><b>End Date: </b>{loan.endDate}</p>
                                }
                              </span>
          
                             {loan.loanStatus === 'approved'  ?

                              <div>

                                {paymentLoanId === loan._id  ?
                                  <div className="input-group mb-3 paymentInputDiv" >
                                      <input type="number" className="form-control"   placeholder="re-pay loan amount" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={(e)=> setPaymentLoanAmount(e.target.value)} value={paymentLoanAmount}/>
                                      <button className="btn btn-primary" onClick={() => makePayment(loan._id)}>Make payment</button>

                                  </div>
                                :
                                  <button className="btn btn-primary" onClick={()=>setPaymentLoanId(loan._id)} >Make payment</button>
                                }
                              </div>

                              :

                              ""
                            
                            }


                            </div>
                        )
                     })}
                          
                 

                      
                      
                  </div>

              </div>

          </div>

          <div className="user-loans-container2">

              <div className="new-user-loans-container">

                  <h3>Apply for New Loan</h3>

                  <select className="form-select" aria-label="Default select example" onChange={(e)=> setNewLoanType(e.target.value)}>
                      <option selected value="">Choose loan type</option>
                      <option value="home-loan">Home loan</option>
                      <option value="vehicle-loan">Vehicle loan</option>
                      <option value="personal-loan">Personal loan</option>
                  </select>

                  <div className="input-row">

                      <div className="form-floating input-row11">
                          <input type="text" className="form-control" id="nomineeNameInput" placeholder="text" onChange={(e)=> setNewNomineeName(e.target.value)} value={newNomineeName}/>
                          <label htmlFor="nomineeNameInput">Nominee name</label>
                      </div>
                      <div className="form-floating input-row12">
                          <input type="number" className="form-control" id="nomineeAgeInput" placeholder="text" onChange={(e)=> setNewNomineeAge(e.target.value)} value={newNomineeAge}/>
                          <label htmlFor="nomineeAgeInput">Age</label>
                      </div>

                  </div>

                  <div className="input-row">

                      <div className="form-floating input-row21">
                          <input type="number" className="form-control" id="user-loanAmountInput" placeholder="text" onChange={(e)=> setNewLoanAmount(e.target.value)} value={newLoanAmount} />
                          <label htmlFor="user-loanAmountInput">loan amount</label>
                      </div>
                      <div className="form-floating input-row22">
                          <input type="number" className="form-control" id="user-loanDurationInput" placeholder="text" onChange={(e)=> setNewLoanDuration(e.target.value)} value={newLoanDuration} />
                          <label htmlFor="user-loanDurationInput">Duration (in months)</label>
                      </div>

                  </div>

                  <p> * I here by agree to all the terms & conditions to make this loan. I agree to pay interest with the dynamic interests depending up on the market conditions. I agree to repay the loan before the deadline.</p>

                  <button className="btn btn-primary" onClick={createNewLoan}>Apply</button>

              </div>
              
          </div>

      </div>



    </>
  )
}

export default Loans