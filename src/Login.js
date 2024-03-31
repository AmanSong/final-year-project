import { React, useState, useEffect } from "react";
import { CForm, CButton } from "@coreui/react";
import './Login.css'

import supabase from "./config/SupabaseClient";
import { useNavigate } from 'react-router-dom';

function Login() {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPasswordMatch, setUserPasswordMatch] = useState("");
    const [signingUp, setSigningUp] = useState(false);
    const navigate = useNavigate();

    function login() {
        const login_user = async () => {
            try {
                const { user, error } = await supabase.auth.signInWithPassword({
                    email: userEmail,
                    password: userPassword
                });

                if (error) {
                    alert('Please check your login credentials!')
                    console.error('error fetching details', error.message);
                    return;
                }

                // if no error has been found, redirect them to main app page
                console.log('Successful log in', user);
                navigate('/main');

            }
            catch (error) {
                console.error('Error logging in:', error.message);
            }
        }
        login_user();
    }

    function signUp() {
        const signup = async () => {
            // do some error checking first
            if (userPassword !== userPasswordMatch) {
                alert('Passwords do not match')
                return
            }
            else if (userPassword.length < 6) {
                alert('Minimum password length is 6!')
                return
            }
            try {
                let { user, error } = await supabase.auth.signUp({
                    email: userEmail,
                    password: userPassword,
                    options: {
                        data: {
                            user_name: userName,
                        }
                    }
                });
                if (error) {
                    console.error('error fetching details', error.message);
                    return;
                }
                alert('A verify link has been sent to the email provided')
            }
            catch (error) {
                console.error('Error in signup:', error.message);
            }
        }
        signup();
    }

    function isSigningUp() {
        setSigningUp(!signingUp)
    }

    return (
        <div className="login-page">

            <div className="login-area">

                <div className="login-logo-section">
                    <img className="login-logo" src="logo.png"></img>
                </div>

                {signingUp ?

                    <CForm className="login-form">

                        <div className="login-title">
                            <h4>Sign up for a new account</h4>
                        </div>

                        <div>
                            <input
                                placeholder="Username"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                placeholder="Email"
                                type="text"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                placeholder="Password"
                                type="password"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                placeholder="Re-Enter your Password"
                                type="password"
                                value={userPasswordMatch}
                                onChange={(e) => setUserPasswordMatch(e.target.value)}
                            />
                        </div>

                        <div className="login-buttons-div">
                            <CButton onClick={() => signUp()}>Sign Up</CButton>
                            <CButton className="signup-button" onClick={() => isSigningUp()}>Return</CButton>
                        </div>

                    </CForm>
                    :
                    <CForm className="login-form">

                        <div className="login-title">
                            <h4>Login to your account</h4>
                        </div>

                        <div>
                            <input
                                placeholder="Email"
                                className="login-form-input"
                                type="text"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                placeholder="Password"
                                type="password"
                                value={userPassword}
                                minLength="6"
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                        </div>

                        <div className="login-buttons-div">
                            <CButton onClick={() => login()}>LOG IN</CButton>
                            <CButton className="signup-button" onClick={() => isSigningUp()}>SIGN UP</CButton>
                        </div>

                    </CForm>
                }
            </div >
        </div >
    )
}

export default Login;