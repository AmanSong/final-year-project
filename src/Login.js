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
            if(userPassword !== userPasswordMatch) {
                alert('Passwords do not match')
                return
            }
            else if(userPassword.length < 6) {
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
                {signingUp ?

                    <CForm className="login-form">

                        <div>
                            <h4>Sign Up</h4>
                        </div>

                        <div>
                            <label>Username:
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>Email:
                                <input
                                    type="text"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>Password:
                                <input
                                    type="password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>Re-Enter your Password:
                                <input
                                    type="password"
                                    value={userPasswordMatch}
                                    onChange={(e) => setUserPasswordMatch(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <CButton onClick={() => signUp()}>Submit</CButton>
                            <CButton className="signup-button" onClick={() => isSigningUp()}>Already signed up?</CButton>
                        </div>

                    </CForm>
                    :
                    <CForm className="login-form">

                        <div>
                            <h4>Welcome, please login or sign up</h4>
                        </div>

                        <div>
                            <label>Email:
                                <input
                                    type="text"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>Password:
                                <input
                                    type="password"
                                    value={userPassword}
                                    minLength="6"
                                    onChange={(e) => setUserPassword(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
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