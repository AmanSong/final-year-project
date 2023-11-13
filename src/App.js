import { React, useState } from "react"
import { CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";
import DisplayImage from "./components/DisplayImage";


function App() {

  const handleProps = (propsData) => {
    const { image, text } = propsData;
    console.log(propsData)
    setPDF(text);
    updateGeneratedImage(image);
  };

  const [generatedImage, updateGeneratedImage] = useState(null);
  const [PDF, setPDF] = useState(null);

  return (
    <div className="App">

      <CHeader className="main-header">
        <h2 id="p-title">Final Year Project</h2>
      </CHeader>

      <div className="components">
        <SidePanel props={handleProps}></SidePanel>

        <DisplayImage image={generatedImage} pdf={PDF}></DisplayImage>
      </div>

    </div>
  );
}

export default App;
