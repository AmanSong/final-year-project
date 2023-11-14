import { React, useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";
import axios from "axios";
import "./FileDrop.css"

function FileDropComponent({ onDataExtracted }) {

    const [fileName, setFileName] = useState('');

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf',
    });

    const [visible, setVisible] = useState(false)

    return (
        <div>
            <CButton className="styledrop-button" onClick={() => setVisible(!visible)} aria-expanded={visible} aria-controls="collapseWidthExample">Upload</CButton>
            <CCollapse  visible={visible}>
                <CCard id="upload-drop-container">
                    <CCardBody>
                        <div {...getRootProps()} className="filedrop">
                            <input {...getInputProps()} />
                            <h4 className="upload-label">{fileName ? fileName : 'Upload File'}</h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default FileDropComponent;