import { CButton, CContainer, CFormInput, CSpinner } from "@coreui/react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { React, useState, useEffect } from "react"
import axios from "axios";
import FileDropComponent from "./FileDropComponent";
import SelectModel from "./SelectModel";
import "./SidePanel.css"
import StyleDrop from "./StyleDrop";
import { CNav, CTabPane, CTabContent } from "@coreui/react";
import StoryGeneration from "./StoryGeneration";
import ImageFormat from "./ImageFormat";
import TextSettings from "./TextSettings";
import Rewrite from "./Rewrite";

function SidePanel({ handleProps, isGenerate }) {

  // states
  const [model, updateModel] = useState('');
  const [dropFileData, setDropFileData] = useState();
  const [activeKey, setActiveKey] = useState(1)
  const [storyTitle, setStoryTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [storyGenerate, setStoryGenerate] = useState(false);
  const [fontName, setFontName] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(15);
  const [toRewrite, setToRewrite] = useState(false);
  const [generatedStory, setGeneratedStory] = useState();

  // Event handler for input change
  const handleStoryInput = (event) => {
    setStoryTitle(event.target.value);
  };

  const handleTextSettings = (fontname, fontsize) => {
    setFontName(fontname);
    setFontSize(fontsize);
  }

  const handleRewrite = (isOn) => {
    setToRewrite(isOn);
  }

  // set the uploaded file from dropFileData
  const setFile = () => {
    setDropFileData((prevDropFileData) => {
      const newData = {
        text: prevDropFileData,
        display: activeKey,
        title: storyTitle,
        generate: true,
        fontName: fontName,
        fontSize: fontSize,
        toRewrite: toRewrite
      };

      // Check if storyTitle is not empty
      if (!prevDropFileData) {
        setVisible(!visible)
        return;
      }

      handleProps(newData);
      console.log('worked', newData);
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
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  // when a model is chosen, call chooseModel function
  useEffect(() => {
    chooseModel();
  }, [model]);


  // to change the display from illustrative to generative
  useEffect(() => {
    handleProps({
      display: activeKey
    });
  }, [activeKey])

  // tell story generation component to generate
  const handleStorySubmit = () => {
    setStoryGenerate(true);
  }


  // handle when a story is returned
  const handleGeneratedStory = (story) => {

    const { generatedStory, Title } = story;

    const newData = {
      story_pdf: generatedStory,
      storyTitle: Title,
      display: activeKey,
    };

    setGeneratedStory((prevStory) => {
      // Make sure to check if the new story is not null before updating
      if (story) {
        handleProps(newData);
        return story;
      }
      return prevStory; // If story is null, keep the previous value
    });
  };

  console.log(isGenerate)

  return (

    <div className="SidePanel-Container">

      <div className="SidePanel">

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

            <div className="illustrate-tab">
              <div className="storyTitleDiv">
                <CFormInput
                  className="storyTitleInput"
                  type="text"
                  placeholder="Title of Story"
                  value={storyTitle}
                  onChange={handleStoryInput} />
              </div>

              <div className="select-container">
                <FileDropComponent onDataExtracted={setDropFileData}></FileDropComponent>
              </div>

              <div className="select-container">
                <StyleDrop></StyleDrop>
              </div>

              <div className="select-container">
                <SelectModel selectedModel={updateModel}></SelectModel>
              </div>

              <div className="select-container">
                <ImageFormat></ImageFormat>
              </div>

              <div className="select-container">
                <TextSettings onTextSettings={handleTextSettings}></TextSettings>
              </div>

              <div className="select-container">
                <Rewrite toggle_rewrite={handleRewrite}></Rewrite>
              </div>

              <CContainer className="select-container">
                {isGenerate ?
                  <CButton disabled={true} className="submit-button"><CSpinner></CSpinner></CButton>
                  :
                  <CButton onClick={() => sendFile()} className="submit-button">Illustrate</CButton>
                }
              </CContainer>
            </div>

          </CTabPane>

          {/* Story generation panel */}
          <CTabPane className="tab-content" visible={activeKey === 2}>

            <div className="story-tab">
              <StoryGeneration
                generate_story={storyGenerate}
                onGenerateStoryComplete={() => setStoryGenerate(false)}
                onUpdateGeneratedStory={handleGeneratedStory}
              ></StoryGeneration>

              <div className="select-container">
                <StyleDrop></StyleDrop>
              </div>

              <div className="select-container">
                <SelectModel selectedModel={updateModel}></SelectModel>
              </div>

              <CContainer className="select-container">
                {storyGenerate ?
                  <CButton disabled={true} className="submit-button"><CSpinner></CSpinner></CButton>
                  :
                  <CButton onClick={handleStorySubmit} className="submit-button">Generate</CButton>
                }
              </CContainer>
            </div>

          </CTabPane>

          <CModal
            className="submit-error-modal"
            alignment="center"
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Warning</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Please ensure a story and title is provided!
            </CModalBody>
          </CModal>


        </CTabContent>

      </div>
    </div>

  );
}

export default SidePanel;
