import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Contact from './Components/Contact';
import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import Chat from './Components/Chat';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Create_NFT from './Components/Create_NFT';
import Email_Verify from './Components/Email_Verify';
import ForgotPage from './Components/ForgotPage';
import Reset_password from './Components/Reset_password';
import Mall from './Components/Mall';
import NFT from './Components/NFT';
import Detail from './Components/Detail';
import EditNFT from './Components/EditNFT';
import AdminDetail from './Components/AdminDetail';
import Cart from './Components/Cart';
import CartDetail from './Components/CartDetail';

import { useLocation } from 'react-router-dom';

const Layout = ({ children, setContractState }) => {
  const location = useLocation();
  const showNavbar = ['/aboutus','/contact','/dashboard',"/login","/signup","/create_nft" ,"/nft","/detail","/admindetail","/editnft","/cart","/cartdetail","/chat",'/' ].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar setContractState={setContractState} />}
      <div className="layout-content">{children}</div>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [alerte, setAlerte] = useState(null);
  const [contractState, setContractState] = useState({
    provider: null,
    signer: null,
    contract: null,
    account: "None"
  });

  const showAlert = (msg, type) => {
    setAlerte({ msg, type });
    setTimeout(() => setAlerte(null), 3000);
  };

  return (
    <GoogleOAuthProvider clientId="295611424523-odmm1reu82i13sfjfqph5rrc0l91cmns.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout setContractState={setContractState}>
                <Home />
              </Layout>
            } 
          />
          <Route path="/login" element={<Layout setContractState={setContractState}><Login showalert={showAlert} /> </Layout>} />


          <Route path="/signup" element={<Layout setContractState={setContractState}><Signup showalert={showAlert} /> </Layout>} />
          <Route path="/Email_Verify" element={<Email_Verify showalert={showAlert} />} />
          <Route path="/ForgotPage" element={<ForgotPage showalert={showAlert} />} />
          <Route path="/Reset_password" element={<Reset_password showalert={showAlert} />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout setContractState={setContractState}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Layout setContractState={setContractState}>
                <Contact />
              </Layout>
            } 
          />
          <Route 
            path="/aboutus" 
            element={
              <Layout setContractState={setContractState}>
                <AboutUs />
              </Layout>
            } 
          />
          <Route 
            path="/create_nft" 
            element={
              <ProtectedRoute>
                <Layout setContractState={setContractState}>
                  <Create_NFT state={contractState} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mall" 
            element={
             
                <Mall />
            
            } 
          />
          <Route path="/nft" element={<Layout setContractState={setContractState}><NFT /></Layout>} />
          <Route path="/detail" element={<Layout setContractState={setContractState}><Detail state={contractState} /></Layout>} />
          <Route path="/adminDetail" element={<Layout setContractState={setContractState}><AdminDetail /></Layout>} />
          <Route path="/editnft" element={<Layout setContractState={setContractState}><EditNFT state={contractState} /></Layout>} />
          <Route path="/cart" element={<Layout setContractState={setContractState}><Cart /> </Layout>}/>
          <Route path="/cartdetail" element={<Layout setContractState={setContractState}><CartDetail state={contractState} /></Layout>} />
          <Route path="/chat" element={<Layout setContractState={setContractState}><Chat /></Layout>} />
         

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;