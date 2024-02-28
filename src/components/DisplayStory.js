import { CContainer, CImage, CProgressBar, CToast, CSpinner, CButton, CToastHeader, CToaster } from "@coreui/react";
import { React, useState, useEffect, useRef } from "react"
import axios from "axios";
import { v4 as uuid } from "uuid";
import supabase from "../config/SupabaseClient";
import './DisplayStory.css'

function DisplayStory({ story, generatedStoryTitle }) {

    const [Story, setStory] = useState(null);
    const [storyTitle, setStoryTitle] = useState(null);
    const [storyPDFURL, setStoryPDFURL] = useState(null);
    const [storyBlob, setStoryBlob] = useState(null);

    const [saving, setSaving] = useState(false);
    const [toast, addToast] = useState(0);
    const toaster = useRef();

    const toastSaved = (
        <CToast>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Successfully saved</div>
          </CToastHeader>
        </CToast>
    )

    console.log(Story)

    useEffect(() => {
        if (story) {
            setStory(story);
            setStoryTitle(generatedStoryTitle);
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
                setStoryBlob(blob);
            } catch (error) {
                console.log(error);
            }
        }
    }, [Story]);

    // function to save the generated pdf
    const SavePDF = async () => {
        if (!storyPDFURL) {
            alert("No pdf to save!");
            return;
        }

        // retrive current user data
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
        }

        if (user.user.id) {
            setSaving(true);

            try {
                // Create a FormData object and append the pdf
                const formData = new FormData();
                formData.append('file', storyBlob, `${storyTitle}.pdf`);

                // Upload the file to Supabase Storage
                const { data, error } = await supabase
                    .storage
                    .from('illustrated-stories')
                    .upload(user.user.id + "/" + storyTitle + " " + uuid(), storyBlob, {
                        contentType: 'pdf'
                    });

                if (error) {
                    console.error('Error uploading PDF:', error.message);
                    return;
                }

                addToast(toastSaved);
                console.log('PDF uploaded successfully:', data);

            } finally {
                setSaving(false);
            }
        } else {
            console.log('Error authenticating user');
        }
    }


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

            {saving ?
                <CButton className="save-pdf-button" onClick={() => SavePDF()} disabled={true}><CSpinner color="info"/></CButton>
                :
                <CButton className="save-pdf-button" onClick={() => SavePDF()} disabled={false}>SAVE</CButton>
            }
            <CToaster ref={toaster} push={toast} placement="top-end" />

        </CContainer>

    );
}

export default DisplayStory;