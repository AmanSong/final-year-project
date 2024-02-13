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
  const [story, setStory] = useState();
  const [currentUser, setCurrentUser] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [storyTitle, setStoryTitle] = useState();

  const handleProps = (propsData) => {
    const { image, text, display, story, title, generate } = propsData;
    SetDisplay(display)
    setPDF(text);
    setStoryTitle(title);
    setStory(story);
  };


  return (
    <div className="App">

      <CHeader className="main-header">
        <img className="logo" src="logo.png"/>
        <UserMenu />
      </CHeader>

      <div className="components">

        <div style={{ display: isSidePanelOpen ? 'block' : 'none' }}>
          <SidePanel handleProps={handleProps}></SidePanel>
        </div>
        <button className="side-panel-button" onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}></button>

        <div className="display">
          <div className="display-container" style={{ display: Display === 1 ? 'block' : 'none' }}>
            <DisplayImage pdf={PDF} storyTitle={storyTitle}></DisplayImage>
          </div>

          <div className="display-container" style={{ display: Display === 2 ? 'block' : 'none' }}>
            <DisplayStory story={story}></DisplayStory>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
