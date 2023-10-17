import { CButton, CContainer, CForm, CFormInput, CImage, CSidebar } from "@coreui/react";
import { React, useState } from "react"
import axios from "axios";
import "./SidePanel.css"
import FileDropComponent from "./FileDropComponent";

function SidePanel() {

  const generate = async (prompt) => {
    // updateLoading(true);
    const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
    // updateImage(result.data);
    // updateLoading(false);
  };

  // retrieve uploaded from user
  const [PDF, UpdatePDF] = useState([]);

  const handleUpload = (file) => {
    UpdatePDF(file)
  }

  return (
    <CSidebar className="SidePanel-main">

      <CContainer className="SidePanel">
          <FileDropComponent onFilesUploaded={handleUpload}/>
          
      </CContainer>

    </CSidebar>
  );
}

export default SidePanel;
