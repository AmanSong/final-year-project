import { CContainer } from "@coreui/react";
import { React, useCallback } from "react"
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./FileDrop.css"

function FileDropComponent({  }) {

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response)
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf',
    });

    return (
        <div {...getRootProps()} className="filedrop">
            <input {...getInputProps()} />
            <h4 className="upload-label">Upload Story</h4>
        </div>
    );
}

export default FileDropComponent;