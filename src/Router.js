import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login';

const RouterControl = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/main" element={<App/>} />
      </Routes>
    </Router>
  );
};

export default RouterControl;
