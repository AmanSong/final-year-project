import { React, useState } from "react"
import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";

import './StyleDrop.css'

function StyleDrop() {

    const [visible, setVisible] = useState(false)

    return (


        <div className="styles-container">
            <CButton className="styledrop-button" onClick={() => setVisible(!visible)}>Styles</CButton>
            <CCollapse id="style-collaspe" visible={visible}>
                <CCard>
                    <CCardBody id="collaspe-card">
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Anime
                        </CButton>
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Realistic
                        </CButton>
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Monochrome
                        </CButton>
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Painting
                        </CButton>
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Pencil
                        </CButton>
                        <CButton className="style-button">
                            <img src="/logo192.png" alt="Button" className="style-image" />
                            Cartoon
                        </CButton>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default StyleDrop;