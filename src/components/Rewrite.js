import { React, useState, useEffect } from "react"
import { CButton, CCard, CCollapse } from "@coreui/react";
import './Rewrite.css'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import axios from "axios";

function Rewrite({ toggle_rewrite }) {

    const [visible, setVisible] = useState(false);

    const [highlighted, setHighlighted] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [selected, SetSelected] = useState('');

    const handleToggle = (event) => {
        setIsOn(event.target.checked);
    };

    const setSelectedRewrite = (value) => {
        // If the clicked button is already selected, deselect it
        if (value === selected) {
            setHighlighted(false);
            SetSelected('');
        } else {
            // Toggle highlight when the same style button is clicked
            setHighlighted(true);
            SetSelected(value);
        }
    };

    const flipArrow = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
        toggle_rewrite(isOn);
    }, [isOn]);

    useEffect(() => {
        const rewrite_choice = async (e) => {
            try {
                const response = await axios.post("http://127.0.0.1:8000/rewrite", {
                    rewrite_to: selected
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error("Error sending data:", error);
            }
        }
        rewrite_choice(selected)
    }, [selected])

    return (
        <div>
            <CButton className="styledrop-button" onClick={() => { setVisible(!visible); flipArrow() }}>
                Re-Write Story
                <CIcon className={`button-icon ${isFlipped ? 'flipped' : ''}`} icon={icon.cilChevronBottom} size="xl" />
            </CButton>
            <CCollapse visible={visible}>
                <CCard className="rewrite-container">
                    <div className="rewrite-info">
                        <h6>Try to re-write the given story Using OpenAI</h6>
                        <h6>Story will be limited to 10 pages</h6>
                    </div>

                    <div id="rewrite-toggle-button">
                        <label>
                            <input type="checkbox" checked={isOn} onChange={handleToggle} />
                            <span className="fill"></span>
                        </label>
                        <h6>Toggle re-write on?</h6>
                    </div>

                    <CCollapse visible={isOn}>
                        <CCard>
                            <CButton
                                onClick={() => setSelectedRewrite('Childrens story book')}
                                className={`rewritten-button ${highlighted && selected === "Children's story book" ? 'high-lighted' : ''}`}>
                                Children's story book
                            </CButton>
                            <CButton
                                onClick={() => setSelectedRewrite('Translate to Irish')}
                                className={`rewritten-button ${highlighted && selected === 'Translate to Irish' ? 'high-lighted' : ''}`}>
                                Translate to Irish
                            </CButton>
                        </CCard>
                    </CCollapse>

                </CCard>
            </CCollapse>
        </div>
    );
}

export default Rewrite;