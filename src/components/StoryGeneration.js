import { React, useCallback, useState } from "react"
import { CButton, CForm, CFormTextarea, CContainer } from "@coreui/react";
import axios from "axios";

function StoryGeneration() {

    const [storyInput, setStoryInput] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [fullStory, setFullStory] = useState('');

    // api to generate story
    // const generateStory = async (prompt) => {
    //     try {
    //         const result = await axios.post(`http://127.0.0.1:8000/story/?prompt=${prompt}`);
    //         return result.data;
    //     } catch (error) {
    //         console.error("Something went wrong: ", error);
    //         return null;
    //     }
    // };

    // let Final = storyInput;

    // const submitStory = async () => {
    // //   for (let i = 0; i < 5; i++) {
    //     const result = await generateStory(Final);
    //     const generatedText = result.story[0].generated_text;
    
    //     // Start with the new generated text in each iteration
    //     Final = generatedText;
    
    //     console.log(Final);
    // //   }
    
    //   console.log('Final Result:', Final);
    // };
    
    
    

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
                <CButton onClick={submitStory}>Submit</CButton>
            </CContainer>

            <p></p>
        </div>
    );
}

export default StoryGeneration;