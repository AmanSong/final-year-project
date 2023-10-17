import { CContainer } from "@coreui/react";
import { React, useCallback } from "react"
import { useDropzone } from "react-dropzone";
import "./FileDrop.css"

function FileDropComponent({onFileUploaded}) {

    const onDrop = useCallback((acceptedFiles) => {
        onFileUploaded(acceptedFiles);
    }, [onFileUploaded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".pdf"
    });

    return (

        <CContainer {...getRootProps()} className="filedrop">
            <input {...getInputProps()} />
            <h4 className="upload-label">Upload Story</h4>
        </CContainer>

    );
}

export default FileDropComponent;