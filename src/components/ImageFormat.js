import { React, useState, useEffect } from "react"
import { CButton, CCard, CCollapse, CContainer } from "@coreui/react";
import './ImageFormat.css'
import axios from "axios";
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';


function ImageFormat() {
    const [visible, setVisible] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('NextPage');
    const [highlighted, setHighlighted] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);

    const flipArrow = () => {
        setIsFlipped(!isFlipped);
    };

    const setFormat = (value) => {
        // If the clicked button is already selected, deselect it
        if (value === selectedFormat) {
            setHighlighted(false);
            setSelectedFormat('');
        } else {
            // Toggle highlight when the same style button is clicked
            setHighlighted(true);
            setSelectedFormat(value);
        }
    };

    const chooseFormat = async (e) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/format", {
                format: selectedFormat
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    useEffect(() => {
        console.log(selectedFormat);
        chooseFormat();
    }, [selectedFormat]);

    return (
        <div className="format-container">
            <CButton className="styledrop-button" onClick={() => { setVisible(!visible); flipArrow() }}>
                Image Formatting
                <CIcon className={`button-icon ${isFlipped ? 'flipped' : ''}`} icon={icon.cilChevronBottom} size="xl" />
            </CButton>
            <CCollapse visible={visible}>
                <CCard className="format-card">
                    <CButton
                        onClick={() => setFormat('NextPage')}
                        className={`format-button ${highlighted && selectedFormat === 'NextPage' ? 'high-lighted' : ''}`}>
                        <img src="/NextPage.png" alt="Button" className="format-image" />
                        Illustrations on the next page
                    </CButton>
                    <CButton
                        onClick={() => setFormat('BehindText')}
                        className={`format-button ${highlighted && selectedFormat === 'BehindText' ? 'high-lighted' : ''}`}>
                        <img src="/BehindText.png" alt="Button" className="format-image" />
                        Illustrations behind text
                    </CButton>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default ImageFormat;