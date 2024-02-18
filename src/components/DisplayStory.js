import { CContainer, CImage, CProgressBar } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayStory.css'

function DisplayStory({ story }) {

    const [Story, setStory] = useState(null);
    const [storyPDFURL, setStoryPDFURL] = useState(null);

    console.log(Story)

    useEffect(() => {
        if (story) {
            setStory(story);
        }
    }, [story]);

    useEffect(() => {
        console.log("Story updated:", Story);
        if (Story) {
            try {
                const blob = new Blob([Story], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                console.log("PDF URL:", url);
                setStoryPDFURL(url);
            } catch (error) {
                console.log(error);
            }
        }
    }, [Story]);
    

    return (
        <CContainer className="story-displayImage">

            <CContainer className="story-displayPDF">
                {storyPDFURL ? (
                    <iframe
                        key={storyPDFURL}
                        title="Story PDF Viewer"
                        src={storyPDFURL}
                        style={{ width: '100%', height: '95%', border: 'none' }}
                    />
                ) : (
                    <div className="empty_pdf">
                        Your illustrated story will be here...
                    </div>
                )}
            </CContainer>

        </CContainer>

    );
}

export default DisplayStory;