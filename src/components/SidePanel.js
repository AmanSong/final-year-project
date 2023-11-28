import { CButton, CContainer } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import FileDropComponent from "./FileDropComponent";
import SelectModel from "./SelectModel";
import "./SidePanel.css"
import StyleDrop from "./StyleDrop";
import { CNav, CTabPane, CTabContent } from "@coreui/react";
import StoryGeneration from "./StoryGeneration";

function SidePanel({ props }) {

  const [visible, setVisible] = useState(true);
  const [model, updateModel] = useState('');
  const [dropFileData, setDropFileData] = useState();
  const [activeKey, setActiveKey] = useState(1)
  const [getStory, setGetStory] = useState('')

  // set the uploaded file from dropFileData
  const setFile = () => {
    setDropFileData((prevDropFileData) => {
      props({
        text: prevDropFileData,
        display: activeKey
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

  useEffect(() => {
    props({
      display: activeKey
    });
  }, [activeKey])


  const handle_story_props = (propsData) => {
    const { story } = propsData;
    setGetStory(story)
  }
  useEffect(() => {
    props({
      display: activeKey,
      story: getStory
    }, [getStory]);
  })

  return (

    <div className="SidePanel-Container">

      <button className="sidebar-button" onClick={() => setVisible(!visible)}>
        |||
      </button>

      <div className="SidePanel" style={{ display: visible ? 'block' : 'none' }}>

        <CNav variant="tabs">
          <CButton
            active={activeKey === 1}

            className="tab-button"
            aria-selected={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Illustrate
          </CButton>
          <CButton
            active={activeKey === 2}
            className="tab-button"
            aria-selected={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            Create
          </CButton>
        </CNav>

        <CTabContent>

          <CTabPane className="tab-content" visible={activeKey === 1}>
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
          </CTabPane>

          <CTabPane className="tab-content"  visible={activeKey === 2}>
            <StoryGeneration story_props={handle_story_props}></StoryGeneration>
          </CTabPane>

        </CTabContent>

      </div>
    </div>

  );
}

export default SidePanel;
