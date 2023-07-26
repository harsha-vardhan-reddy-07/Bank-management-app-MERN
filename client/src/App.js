import './App.css';
import { Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing.jsx';
import Home from './Pages/Home';
import Admin from './Pages/Admin';
import Deposits from './Pages/Deposits';
import Loans from './Pages/Loans';
import AdminDeposits from './Pages/AdminDeposits';
import AdminLoans from './Pages/AdminLoans';
import AllTransactions from './Pages/AllTransactions';
import AllUsers from './Pages/AllUsers';
import LoginProtector from './RouteProtectors/AuthProtector';
import AuthProtector from './RouteProtectors/LoginProtector';

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route exact path='' element={<LoginProtector> <Landing /> </LoginProtector> } />
        <Route  path='/home' element={<AuthProtector><Home /></AuthProtector>} />
        <Route  path='/deposits' element={ <AuthProtector><Deposits /></AuthProtector>} />
        <Route  path='/loans' element={ <AuthProtector><Loans /></AuthProtector>} />

        <Route  path='/admin' element={ <AuthProtector><Admin /></AuthProtector>} />
        <Route  path='/all-users' element={ <AuthProtector><AllUsers /></AuthProtector>} />
        <Route  path='/all-deposits' element={ <AuthProtector><AdminDeposits /></AuthProtector>} />
        <Route  path='/all-loans' element={ <AuthProtector><AdminLoans /></AuthProtector>} />
        <Route  path='/all-transactions' element={<AuthProtector><AllTransactions /></AuthProtector>} />
      </Routes>
    </div>
  );
}

export default App;
