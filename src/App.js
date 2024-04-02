import { React, useState, useEffect } from "react"
import { CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";
import DisplayImage from "./components/DisplayImage";
import DisplayStory from "./components/DisplayStory";
import UserMenu from "./components/UserMenu";

function App() {

  const [PDF, setPDF] = useState(null);
  const [Display, SetDisplay] = useState(1);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [storyTitle, setStoryTitle] = useState();
  const [status, setStatus] = useState();
  const [fontName, setFontName] = useState();
  const [fontSize, setFontSize] = useState();
  const [toRewrite, setToRewrite] = useState();
  const [story, setStory] = useState(null);
  const [generatedStoryTitle, setGeneratedStoryTitle] = useState(null);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [amount, setAmount] = useState(5);

  const handleProps = (propsData) => {
    const { text, display, title, story_pdf, storyTitle, fontName, fontSize, toRewrite, amount } = propsData;
    SetDisplay(display)
    setPDF(text);
    setStoryTitle(title);
    setStory(story_pdf);
    setGeneratedStoryTitle(storyTitle);
    setFontName(fontName);
    setFontSize(fontSize);
    setToRewrite(toRewrite);
    setAmount(amount);

    setTriggerUpdate((prev) => !prev);
  };

  const handleReturnedStatus = (returnedValue) => {
    setStatus(returnedValue);
  };


  return (
    <div className="App">

      <CHeader className="main-header">
        <img className="logo" src="logo.png" />
        <UserMenu />
      </CHeader>

      <div className="components">

        <div style={{ display: isSidePanelOpen ? 'block' : 'none' }}>
          <SidePanel handleProps={handleProps} isGenerate={status}></SidePanel>
        </div>
        <button className="side-panel-button" onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}></button>

        <div className="display">
          <div className="display-container" style={{ display: Display === 1 ? 'block' : 'none' }}>
            <DisplayImage
              pdf={PDF}
              storyTitle={storyTitle}
              returnStatus={handleReturnedStatus}
              fontName={fontName}
              fontSize={fontSize}
              toRewrite={toRewrite}
              triggerUpdate={triggerUpdate}
              amount={amount}
            ></DisplayImage>
          </div>

          <div className="display-container" style={{ display: Display === 2 ? 'block' : 'none' }}>
            <DisplayStory story={story} generatedStoryTitle={generatedStoryTitle} ></DisplayStory>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
