import { React, useState, useEffect } from "react"
import { CButton, CCard, CCollapse, CFormRange } from "@coreui/react";
import './TextSettings.css'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';


function TextSettings({ onTextSettings }) {

    const [visible, setVisible] = useState(false);
    //Helvetica, Courier, Times Roman

    const [fontSize, setFontSize] = useState(15);
    const [fontName, setFontName] = useState('Helvetica');
    const [highlighted, setHighlighted] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);

    const flipArrow = () => {
        setIsFlipped(!isFlipped);
    };

    const setFont = (value) => {
        // If the clicked button is already selected, deselect it
        if (value === fontName) {
            setHighlighted(false);
            setFontName('Helvetica');
        } else {
            // Toggle highlight when the same style button is clicked
            setHighlighted(true);
            setFontName(value);
        }
    };

    useEffect(() => {
        onTextSettings(fontName, fontSize);
    }, [fontName, fontSize]);

    return (
        <div className="genre-container">
            <CButton className="styledrop-button" onClick={() => { setVisible(!visible); flipArrow() }}>
                Text Settings
                <CIcon className={`button-icon ${isFlipped ? 'flipped' : ''}`} icon={icon.cilChevronBottom} size="xl" />
            </CButton>
            <CCollapse visible={visible}>
                <CCard className="textsettings-card">
                    <div className="font-size-selection">
                        <h6>Font Size</h6>
                        <CFormRange onChange={(event) => setFontSize(event.target.value)} className="range-selector" min={15} max={30} label={fontSize} defaultValue="15" />
                    </div>

                    <div className="fontname-buttons-container">
                        <CButton
                            onClick={() => setFont('Helvetica')}
                            id="font-button-helvetica"
                            className={`font-button ${highlighted && fontName === 'Helvetica' ? 'highlighted' : ''}`}>
                            Helvetica
                        </CButton>
                        <CButton
                            onClick={() => setFont('Courier')}
                            id="font-button-courier"
                            className={`font-button ${highlighted && fontName === 'Courier' ? 'highlighted' : ''}`}>
                            Courier
                        </CButton>
                        <CButton
                            onClick={() => setFont('Times-Roman')}
                            id="font-button-times-roman"
                            className={`font-button ${highlighted && fontName === 'Times-Roman' ? 'highlighted' : ''}`}>
                            Times-Roman
                        </CButton>
                    </div>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default TextSettings;
