import { React, useCallback, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer } from "@coreui/react";
import axios from "axios";

function StoryGeneration() {

    const [storyInput, setStoryInput] = useState('');
    const [story, setStory] = useState('')

    // api to generate story
    const generateStory = async (prompt) => {
        try {
          const response = await axios.post("http://127.0.0.1:8000/story", {
            story_prompt : prompt
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return response.data
        } catch (error) {
          console.error("Error sending data:", error);
        }
      }

    const submitStory = async () => {
        const result = await generateStory(storyInput)
        setStory(result.generated_story)
        console.log(story)
    };
    
    return (
        <div>
            <CForm>
                <CFormTextarea
                    id="story-input"
                    label="Your story prompt"
                    rows={5}
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                />
            </CForm>

            <CContainer className="submit-story">
                <CButton onClick={() => submitStory()}>Submit</CButton>
            </CContainer>
            <p></p>
        </div>
    );
}

export default StoryGeneration;