import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login';
import SecureRoute from './SecureRoute';
import SavedStories from './components/SavedStories';

const RouterControl = () => {
    return (
        <Router>
            <Routes>

                <Route element={<SecureRoute />}>
                    <Route path="/main" element={<App />} />
                    <Route path="/main/savedStories" element={<SavedStories />} />
                </Route>

                <Route path="/" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default RouterControl;
