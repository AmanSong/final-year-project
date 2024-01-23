import { React, useState } from "react";
import { CForm, CButton } from "@coreui/react";
import './Login.css'

function Login() {

    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    return (
        <div className="login-page">
            <div className="login-area">
                <CForm className="login-form">

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
                        <label>Password:
                            <input
                                type="text"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <CButton onClick={() => alert('hi')}>LOG IN</CButton>
                        <CButton onClick={() => alert('hi')}>SIGN UP</CButton>
                    </div>

                </CForm>
            </div >
        </div >
    )
}

export default Login;