import { CButton, CContainer, CForm, CFormInput, CImage, CSidebar } from "@coreui/react";
import { React, useState, useCallback } from "react"
import axios from "axios";
import FileDropComponent from "./FileDropComponent";

import "./SidePanel.css"
import SelectModel from "./SelectModel";

function SidePanel({ image }) {

  const [prompt, updatePrompt] = useState('');
  const [loading, updateLoading] = useState(false);
  const [model, updateModel] = useState('');
  const [PDF, updatePDF] = useState([]);

  const generate = async (prompt) => {
    updateLoading(true);
    const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
    image(result.data);
    updateLoading(false);
  };

  const handleUpload = (file) => {
    updatePDF(file)
  }

  console.log(model)

  return (

    <div className="SidePanel">

      <CContainer className="inputContainer">
        <CForm className="form">
          <CFormInput
            type="text"
            label="Enter Prompt"
            value={prompt}
            onChange={(e) => updatePrompt(e.target.value)}
          />
        </CForm>
        <CButton className="generateButton" onClick={(e) => generate(prompt)}>Generate</CButton>
      </CContainer>

      <SelectModel selectedModel={updateModel}></SelectModel>

      <FileDropComponent onFilesUploaded={handleUpload} />

    </div>
  );
}

export default SidePanel;
