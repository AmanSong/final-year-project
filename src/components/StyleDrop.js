import { React } from "react"
import { CButton } from "@coreui/react";

import './StyleDrop.css'

function StyleDrop() {


    return (
        <div className="styles-container">
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
        </div>
    );
}

export default StyleDrop;