import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Dash from './pages/dashboard/dash.jsx';
import About from './pages/about/About.jsx';
import Govt from './pages/govt/govtS.jsx';
import Login from './pages/login/login.jsx';
import SignUp from './pages/signup/sign.jsx';
import ContactPage from './pages/contacts/contact.jsx';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dash />} />
          <Route path="/about" element={<About />} />
          <Route path="/government-schemes" element={<Govt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contacts" element={<ContactPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;