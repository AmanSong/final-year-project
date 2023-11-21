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
  const [story, setStory] = useState('');

  const handleProps = (propsData) => {
    const { image, text, display, story } = propsData;
    console.log(propsData)
    console.log(display)
    SetDisplay(display)
    setPDF(text);
    updateGeneratedImage(image);
    setStory(story);
  };

  return (
    <div className="App">

      <CHeader className="main-header">
        <h2 id="p-title">Final Year Project</h2>
      </CHeader>

      <div className="components">
        <SidePanel props={handleProps}></SidePanel>

        <div className="display-container" style={{ display: Display === 1 ? 'block' : 'none' }}>
          <DisplayImage image={generatedImage} pdf={PDF}></DisplayImage>
        </div>

        <div className="display-container" style={{ display: Display === 2 ? 'block' : 'none' }}>
          <DisplayStory story={story}></DisplayStory>
        </div>
      </div>

    </div>
  );
}

export default App;
