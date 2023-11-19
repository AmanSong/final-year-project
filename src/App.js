import { React, useState } from "react"
import { CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";
import DisplayImage from "./components/DisplayImage";
import DisplayStory from "./components/DisplayStory";


function App() {

  const [generatedImage, updateGeneratedImage] = useState(null);
  const [PDF, setPDF] = useState(null);
  const [Display, SetDisplay] = useState(1);

  const handleProps = (propsData) => {
    const { image, text, display } = propsData;
    console.log(propsData)
    console.log(display)
    SetDisplay(display)
    setPDF(text);
    updateGeneratedImage(image);
  };

  return (
    <div className="App">

      <CHeader className="main-header">
        <h2 id="p-title">Final Year Project</h2>
      </CHeader>

      <div className="components">
        <SidePanel props={handleProps}></SidePanel>

        {Display === 1 ? 
        <DisplayImage image={generatedImage} pdf={PDF}></DisplayImage> 
        :
        <DisplayStory></DisplayStory>}
      </div>

    </div>
  );
}

export default App;
