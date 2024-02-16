import { React, useEffect, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer, CFormRange } from "@coreui/react";
import Genre from "./Genre";
import './StoryGeneration.css';

function StoryGeneration( {generate_story, onGenerateStoryComplete} ) {

  const [storyInput, setStoryInput] = useState('');
  const [GeneratedStory, setGeneratedStory] = useState('');

  const [genres, setGenres] = useState([]);
  const [amount, setAmount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenre = (selectedGenres) => {
    setGenres(selectedGenres);
  }

  useEffect(() => {
    if (generate_story && !isGenerating) {
      // Set isGenerating to true to prevent further triggers until actions are complete
      setIsGenerating(true);

      // Simulate asynchronous actions (replace with your actual logic)
      setTimeout(() => {
        console.log('Actions complete.');

        // Call the callback function to update the parent state
        onGenerateStoryComplete();
        setIsGenerating(false);
      }, 2000); // Adjust the timeout value based on your actual asynchronous actions
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