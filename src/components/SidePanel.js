import { CButton, CContainer, CForm, CFormInput, CImage, CSidebar } from "@coreui/react";
import {React, useState} from "react"
import "./SidePanel.css"
import axios from "axios";


function SidePanel() {

const [image, updateImage] = useState();
const [prompt, updatePrompt] = useState('');
const [loading, updateLoading] = useState();

const generate = async (prompt) => {
    updateLoading(true);
    const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
    updateImage(result.data);
    updateLoading(false);
};


  return (
    <CSidebar className="SidePanel-main">
        <CContainer>
            <CForm>
                <CFormInput
                    type="text"
                    label="Enter prompt"
                    value={prompt}
                    onChange={(e) => updatePrompt(e.target.value)}
                />
            </CForm>
            <CButton onClick={(e) => generate(prompt)}>Generate</CButton>
        </CContainer>

        {loading ? (
          <h1>LOADING...</h1>
        ) : image ? (
          <CImage src={`data:image/png;base64,${image}`}></CImage>
        ) : null}
    </CSidebar>
  );
}

export default SidePanel;
