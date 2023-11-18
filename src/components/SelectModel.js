import { CButton, CCollapse, CCard } from "@coreui/react";
import { React, useState, useEffect } from "react"

import './SelectModel.css'

function SelectModel({ selectedModel }) {

    const [visible, setVisible] = useState(false)
    const [highlight, setHighlight] = useState(false)
    const [selected, SetSelected] = useState('CompVis/stable-diffusion-v1-4')

    useEffect(() => {
        setHighlight(true); 
    }, []);

    const dropdownSelect = (value) => {
        if (value === selected) {
            setHighlight(false);
            SetSelected('');
        } else {
            // Toggle highlight when the same style button is clicked
            setHighlight(true);
            SetSelected(value);
        }
        selectedModel(value)
    };

    return (
        <div>
            <CButton className="styledrop-button" onClick={() => setVisible(!visible)}>Styles</CButton>
            <CCollapse id="model-collaspe" visible={visible}>
                <CCard>
                    <CButton
                        onClick={() => dropdownSelect('CompVis/stable-diffusion-v1-4')}
                        className={`model-button ${highlight && selected === 'CompVis/stable-diffusion-v1-4' ? 'highlighted' : ''}`}>
                        CompVis/StableDiffusion-v1-4 <br></br>
                        -fast but low quality-
                    </CButton>
                    <CButton
                        onClick={() => dropdownSelect('stable-diffusion-xl-base-1.0')}
                        className={`model-button ${highlight && selected === 'stable-diffusion-xl-base-1.0' ? 'highlighted' : ''}`}>
                        StableDiffusion-XL-Base-1.0 <br></br>
                        -Slow but high quality-
                    </CButton>
                    <CButton
                        onClick={() => dropdownSelect('pixel-art-xl')}
                        className={`model-button ${highlight && selected === 'pixel-art-xl' ? 'highlighted' : ''}`}>
                        Pixel-Art-XL <br></br>
                        -fast, good quality, no style needed-
                    </CButton>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default SelectModel;
