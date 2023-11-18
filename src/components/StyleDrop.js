import { React, useState, useEffect } from "react"
import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";
import axios from "axios";

import './StyleDrop.css'

function StyleDrop() {
    const [visible, setVisible] = useState(false)
    const [selectedStyle, setSelectedStyle] = useState('')
    const [highlight, setHighlight] = useState(false)

    const setStyle = (value) => {
        // If the clicked button is already selected, deselect it
        if (value === selectedStyle) {
            setHighlight(false);
            setSelectedStyle('');
        } else {
            // Toggle highlight when the same style button is clicked
            setHighlight(true);
            setSelectedStyle(value);
        }
    };

    const chooseStyle = async (e) => {
        try {
          const response = await axios.post("http://127.0.0.1:8000/style", {
            style : selectedStyle
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
        console.log(selectedStyle);
        chooseStyle();
    }, [selectedStyle]);
    

    return (
        <div className="styles-container">
            <CButton className="styledrop-button" onClick={() => setVisible(!visible)}>Select image style</CButton>
            <CCollapse id="style-collaspe" visible={visible}>
                <CCard>
                    <CCardBody id="collaspe-card">
                        <CButton
                            onClick={() => setStyle('anime, anime style, anime art')}
                            className={`style-button ${highlight && selectedStyle === 'anime, anime style, anime art' ? 'highlighted' : ''}`}>
                            <img src="/style_anime.png" alt="Button" className="style-image" />
                            Anime
                        </CButton>
                        <CButton onClick={() => setStyle('artistic, artisic style, artwork')}
                            className={`style-button ${highlight && selectedStyle === 'artistic, artisic style, artwork' ? 'highlighted' : ''}`}>
                            <img src="/style_artistic.png" alt="Button" className="style-image" />
                            Artistic
                        </CButton>
                        <CButton onClick={() => setStyle('realistic, photography, 4k')}
                            className={`style-button ${highlight && selectedStyle === 'realistic, photography, 4k' ? 'highlighted' : ''}`}>
                            <img src="/style_realistic.png" alt="Button" className="style-image" />
                            Realistic
                        </CButton>
                        <CButton onClick={() => setStyle('painting, painting style, artwork')}
                            className={`style-button ${highlight && selectedStyle === 'painting, painting style, artwork' ? 'highlighted' : ''}`}>
                            <img src="/style_painting.png" alt="Button" className="style-image" />
                            Painting
                        </CButton>
                        <CButton onClick={() => setStyle('drawing, pencil, handdrawn, art')}
                            className={`style-button ${highlight && selectedStyle === 'drawing, pencil, handdrawn, art' ? 'highlighted' : ''}`}>
                            <img src="/style_pencil.png" alt="Button" className="style-image" />
                            Pencil
                        </CButton>
                        <CButton onClick={() => setStyle('cartoon style, cartoons, comic style')}
                            className={`style-button ${highlight && selectedStyle === 'cartoon style, cartoons, comic style' ? 'highlighted' : ''}`}>
                            <img src="/style_cartoon.png" alt="Button" className="style-image" />
                            Cartoon
                        </CButton>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default StyleDrop;