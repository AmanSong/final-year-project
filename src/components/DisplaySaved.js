import { React, useState } from "react"
import './DisplaySaved.css'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

const DisplaySaved = ({ pdfContent, pdfDetail, closeViewer, Delete }) => {

    const [deleteConfirm, setDeleteConfirm] = useState(false)

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

    const deleteAndClose = () => {
        // Call both functions
        Delete();
        closeViewer();
    };

    return (
        <div className="display-saved">
            <div className="saved-buttons">
                <button className="delete-story-button">
                    <CIcon icon={icon.cilTrash} size="lg" onClick={() => setDeleteConfirm(!deleteConfirm)} />
                </button>
                <button className="display-fullscreen-button" onClick={toggleFullscreen}>
                    <CIcon icon={icon.cilFullscreen} size="lg" />
                </button>
                <button className="display-saved-button" onClick={closeViewer}>
                    <CIcon icon={icon.cilX} size="lg" />
                </button>
            </div>
            <embed src={url} type="application/pdf" />

            <CModal
                visible={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
            >
                <CModalHeader onClose={() => setDeleteConfirm(false)}>
                    <CModalTitle >Confirm Deletion?</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to delete "{pdfDetail.name}"?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={() => deleteAndClose()}>Yes</CButton>
                </CModalFooter>
            </CModal>

        </div>
    );

};


export default DisplaySaved;