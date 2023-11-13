import { React, useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
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

    return (
        <div {...getRootProps()} className="filedrop">
            <input {...getInputProps()} />
            <h4 className="upload-label">{fileName ? fileName : 'Upload File'}</h4>
        </div>
    );
}

export default FileDropComponent;