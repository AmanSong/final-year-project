import { CButton, CContainer, CForm, CFormInput, CImage, CSidebar } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import FileDropComponent from "./FileDropComponent";
import SelectModel from "./SelectModel";
import "./SidePanel.css"


function SidePanel({ props }) {

  const [visible, setVisible] = useState(true);

  const [prompt, updatePrompt] = useState('');
  const [model, updateModel] = useState('');
  const [dropFileData, setDropFileData] = useState();

  const generate = async (prompt) => {
    const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
    props({
      image: result.data,   
      text: dropFileData   
    });
  };

  const chooseModel = async (e) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/selectModel", {
        model: model
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  useEffect(() => {
    chooseModel();
  }, [model]);

  const setFile = () => {
    props({
      text: dropFileData
    });
    console.log('worked', dropFileData)
  }

  useEffect(() => {
    setFile();
  }, [dropFileData]);

  return (

    <div className="SidePanel-Container">

      <button className="sidebar-button" onClick={() => setVisible(!visible)}>|||</button>

      <div className="SidePanel" style={{ display: visible ? 'block' : 'none' }}>

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

        <div className="selectModal-container">
          <SelectModel selectedModel={updateModel}></SelectModel>
        </div>

        <FileDropComponent onDataExtracted={setDropFileData}></FileDropComponent>

      </div>
    </div>

  );
}

export default SidePanel;
