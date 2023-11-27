import { CButton, CCollapse, CCard } from "@coreui/react";
import { React, useState, useEffect } from "react"

import './SelectModel.css'

function SelectModel({ selectedModel }) {

    const [visible, setVisible] = useState(false)
    const [highlight, setHighlight] = useState(false)
    const [selected, SetSelected] = useState('CompVis/stable-diffusion-v1-4')

    const dropdownSelect = (value) => {
        // Toggle highlight when the same style button is clicked
        SetSelected((prevSelected) => (prevSelected === value ? '' : value));
    };
    
    // Automatically call selectedModel when the component mounts or selected model changes
    useEffect(() => {
        // Get the selected model from local storage
        const storedModel = localStorage.getItem('selectedModel');
    
        if (storedModel) {
            SetSelected(storedModel);
            selectedModel(storedModel);
        }
    }, []); // The empty dependency array ensures this effect runs only once, on mount
    
    // Update local storage and call selectedModel when the selected model changes
    useEffect(() => {
        if (selected) {
            localStorage.setItem('selectedModel', selected);
            selectedModel(selected);
            setHighlight(true)
        }
    }, [selected]);

    return (
        <div>
            <CButton className="styledrop-button" onClick={() => setVisible(!visible)}>Select AI Model</CButton>
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
