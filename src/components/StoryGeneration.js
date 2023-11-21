import { React, useEffect, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer } from "@coreui/react";
import axios from "axios";
import StyleDrop from "./StyleDrop";
import SelectModel from "./SelectModel";

function StoryGeneration( { story_props } ) {

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
    };

    // update when a story is returned
    useEffect(() => {
      story_props({
        story: story,
      });
    }, [story])
    
    return (
        <div>
            <CForm>
                <CFormTextarea
                    id="story-input"
                    label="Your story prompt"
                    placeholder="Once upon a time..."
                    rows={5}
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                />
            </CForm>

            <StyleDrop></StyleDrop>
            <SelectModel></SelectModel>

            <CContainer className="submit-story">
                <CButton onClick={() => submitStory()}>Submit</CButton>
            </CContainer>
            <p></p>
        </div>
    );
}

export default StoryGeneration;