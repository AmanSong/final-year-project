import { React, useEffect, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer } from "@coreui/react";
import axios from "axios";
import StyleDrop from "./StyleDrop";
import SelectModel from "./SelectModel";
import Genre from "./Genre";
import './StoryGeneration.css';

function StoryGeneration({ story_props }) {

  const [storyInput, setStoryInput] = useState('');
  const [GeneratedStory, setGeneratedStory] = useState('');
  const [genres, setGenres] = useState([])

  const handleGenre = (selectedGenres) => {
    setGenres(selectedGenres);
  }

  return (
    <div className="story-tab">

      <CForm className="form-input">
        <CFormTextarea
          id="story-input"
          label="Give some context"
          placeholder="A hero needs to defeat an evil dragon..."
          rows={5}
          value={storyInput}
          onChange={(e) => setStoryInput(e.target.value)}
        />
      </CForm>

      <div className="genre-div">
        <Genre onGenresSelected={handleGenre}></Genre>
      </div>

      <CContainer className="submit-story">
        {/* <CButton onClick={() => submitStory()}>Submit</CButton> */}
      </CContainer>
      <p></p>
    </div>
  );
}

export default StoryGeneration;