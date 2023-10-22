import { React, useState } from "react"
import { CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";
import DisplayImage from "./components/DisplayImage";


function App() {

  const [generatedImage, updateGeneratedImage] = useState(null);

  return (
    <div className="App">
      <CHeader className="main-header">
        <h2 id="p-title">Final Year Project</h2>
      </CHeader>

      <div className="componenets">
        <SidePanel image={updateGeneratedImage}></SidePanel>

        <DisplayImage image={generatedImage}></DisplayImage>
      </div>
    </div>
  );
}

export default App;
