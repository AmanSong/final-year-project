import { React, useEffect, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer, CFormRange, CFormInput } from "@coreui/react";
import Genre from "./Genre";
import axios from "axios";
import './StoryGeneration.css';

function StoryGeneration({ generate_story, onGenerateStoryComplete, onUpdateGeneratedStory }) {

  const [storyInput, setStoryInput] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [genres, setGenres] = useState([]);
  const [amount, setAmount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenre = (selectedGenres) => {
    setGenres(selectedGenres);
  }

  // when user clicks generate, call api endpoint to generate
  useEffect(() => {
    if (generate_story && !isGenerating) {
      setIsGenerating(true);

      // call endpoint
      const generateStory = async (storyInput, storyTitle, genres, amount) => {
        try {
          const response = await axios.post("http://127.0.0.1:8000/story", {
            story_prompt: storyInput,
            story_title: storyTitle,
            genres: genres,
            amount: amount
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer'
          });

          console.log(response);
          const GeneratedStory = response.data;

          console.log(GeneratedStory)

          // Callback to pass the updated GeneratedStory to the parent component
          onUpdateGeneratedStory({ generatedStory: GeneratedStory, Title: storyTitle });

          setIsGenerating(false);
          onGenerateStoryComplete();
        } catch (error) {
          console.error("Error sending data:", error);
          setIsGenerating(false);
          onGenerateStoryComplete();
        }
      }
      generateStory(storyInput, storyTitle, genres, amount);

    }
  }, [generate_story, isGenerating, onGenerateStoryComplete]);

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

      <div className="storyTitleDiv">
        <CFormInput
          className="storyTitleInput"
          type="text"
          placeholder="Title of Story"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)} />
      </div>

      <div className="page-amount-selection">
        <h6>Page Amount</h6>
        <CFormRange onChange={(event) => setAmount(event.target.value)} className="range-selector" min={1} max={10} label={amount} defaultValue="1" />
      </div>

      <div className="genre-div">
        <Genre onGenresSelected={handleGenre}></Genre>
      </div>

    </div>
  );
}

export default StoryGeneration;