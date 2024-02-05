import { React, useState, useEffect } from "react"
import { CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";
import DisplayImage from "./components/DisplayImage";
import DisplayStory from "./components/DisplayStory";

import supabase from "./config/SupabaseClient";
import UserMenu from "./components/UserMenu";

function App() {

  //const [generatedImage, updateGeneratedImage] = useState(null);
  const [PDF, setPDF] = useState(null);
  const [Display, SetDisplay] = useState(1);
  const [story, setStory] = useState();
  const [currentUser, setCurrentUser] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [storyTitle, setStoryTitle] = useState();

  const handleProps = (propsData) => {
    const { image, text, display, story, title } = propsData;
    console.log(propsData)
    console.log(display)
    console.log(story)
    console.log(title)
    //console.log(generatedImage)
    SetDisplay(display)
    setPDF(text);
    setStoryTitle(title);
    //updateGeneratedImage(image);
    setStory(story);
  };

  useEffect(() => {
    const getUserName = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      setCurrentUser(user.user.user_metadata.user_name)
    }
    getUserName();
  }, []);

  return (
    <div className="App">

      <CHeader className="main-header">
        <h4 id="p-title">Good to see you, {currentUser}</h4>
        <UserMenu />
      </CHeader>

      <div className="components">

        <div style={{ display: isSidePanelOpen ? 'block' : 'none' }}>
          <SidePanel props={handleProps}></SidePanel>
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
