import { CButton, CContainer, CForm, CFormInput, CImage, CSidebar } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import FileDropComponent from "./FileDropComponent";
import SelectModel from "./SelectModel";
import "./SidePanel.css"
import StyleDrop from "./StyleDrop";


function SidePanel({ props }) {

  const [visible, setVisible] = useState(true);
  const [model, updateModel] = useState('');
  const [dropFileData, setDropFileData] = useState();

  // set the uploaded file from dropFileData
  const setFile = () => {
    setDropFileData((prevDropFileData) => {
      props({
        text: prevDropFileData
      });
      console.log('worked', prevDropFileData);
      return prevDropFileData;
    });
  }

  const sendFile = () => {
    setFile();
  }


  // to allow for changing of ai models from backend
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

  return (

    <div className="SidePanel-Container">

      <button className="sidebar-button" onClick={() => setVisible(!visible)}>
        |||
      </button>

      <div className="SidePanel" style={{ display: visible ? 'block' : 'none' }}>

        <div className="upload-container">
          <FileDropComponent onDataExtracted={setDropFileData}></FileDropComponent>
        </div>

        <div className="styleSelect-container">
          <StyleDrop></StyleDrop>
        </div>

        <div className="selectModal-container">
          <SelectModel selectedModel={updateModel}></SelectModel>
        </div>

        <CContainer className="submit-button-container">
          <CButton onClick={() => sendFile()} className="submit-button">Submit</CButton>
        </CContainer>

      </div>
    </div>

  );
}

export default SidePanel;
