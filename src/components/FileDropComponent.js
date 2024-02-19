import { React, useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
import { CButton, CCollapse, CCard, CCardBody, CFormInput } from "@coreui/react";
import axios from "axios";
import "./FileDrop.css"

import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

function FileDropComponent({ onDataExtracted }) {

    const [fileName, setFileName] = useState('');
    const [visible, setVisible] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false);

    const flipArrow = () => {
      setIsFlipped(!isFlipped);
    };

    // this is the drop file component using the react-dropzone library
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        setFileName(file.name)

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response)
            if (response.status === 200) {
                onDataExtracted(response.data);
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }, []);

    // if a user drops file, accept only PDF and call function
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'], 
        },
    });

    return (
        <div>
            <CButton className="styledrop-button" onClick={() => {setVisible(!visible); flipArrow()}} aria-expanded={visible} aria-controls="collapseWidthExample">
                <div>
                    Upload PDF Story 
                    <CIcon className={`button-icon ${isFlipped ? 'flipped' : ''}`} icon={icon.cilChevronBottom} size="xl"/>
                </div>
            </CButton>
            <CCollapse  visible={visible}>
                <CCard id="upload-drop-container">
                    <CCardBody id="upload-drop-card">
                        {/* Handle user file drops */}
                        <div {...getRootProps()} className="filedrop">
                            <input {...getInputProps()} />
                            <h4 className="upload-label">{fileName ? fileName : <CIcon icon={icon.cilArrowThickFromBottom} size="xxl"/>}</h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default FileDropComponent;