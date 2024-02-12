import { React } from "react"
import './DisplaySaved.css'

import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

const DisplaySaved = ({ pdfContent, closeViewer }) => {

    const url = URL.createObjectURL(pdfContent);

    const toggleFullscreen = () => {
        const elem = document.querySelector('.display-saved');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    };

    return (
        <div className="display-saved">
            <div className="saved-buttons">
            <button className="display-fullscreen-button" onClick={toggleFullscreen}>
                <CIcon icon={icon.cilFullscreen} size="m"/>
            </button>
            <button className="display-saved-button" onClick={closeViewer}>
                <CIcon icon={icon.cilX} size="m"/>
            </button>
            </div>
            <embed src={url} type="application/pdf" />
        </div>
    );

};


export default DisplaySaved;