import { CProgress, CProgressBar, CContainer, CSpinner, CButton } from "@coreui/react";
import { CToast, CToastHeader, CToaster } from '@coreui/react';
import { React, useState, useEffect, useRef } from "react"
import axios from "axios";
import './DisplayImage.css'
import supabase from "../config/SupabaseClient";
import { v4 as uuid } from "uuid";

function DisplayImage({ pdf, storyTitle, returnStatus, fontName, fontSize }) {

    const [isGenerating, setIsGenerating] = useState(false);
    const [PDF, setPDF] = useState();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null)
    const [Title, setStoryTitle] = useState(null);
    const [FontName, setFontName] = useState()
    const [FontSize, setFontSize] = useState()
    // give a default value for 5 images to generate
    const [amountToGen, setAmountToGen] = useState(1);
    const [progressValue, setProgressValue] = useState(0);

    const [forceUpdate, setForceUpdate] = useState(false);
    const [saving, setSaving] = useState(false);

    const [toast, addToast] = useState(0)
    const toaster = useRef()

    const toastSaved = (
        <CToast>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Successfully saved</div>
          </CToastHeader>
        </CToast>
    )
    
    useEffect(() => {
        if (pdf) {
            console.log('hi')
            setPDF(pdf);
            setStoryTitle(storyTitle);
            setFontName(fontName);
            setFontSize(fontSize);
            setForceUpdate(prevState => !prevState);
        }
    }, [pdf, storyTitle]);

    // api to generate images
    const generate = async (prompt) => {
        try {
            const result = await axios.post(`http://127.0.0.1:8000/?prompt=${prompt}`);
            return result.data;
        } catch (error) {
            console.error("Something went wrong: ", error);
            return null;
        }
    };

    const create = async (Text, Images, Title, FontName, FontSize) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/createPDF", {
                text: Text,
                images: Images,
                title: Title,
                fontName: FontName,
                fontSize: FontSize
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer'
            });
            console.log(response);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            setPdfBlob(blob)
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            setProgressValue(100);
            setIsGenerating(false);

        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    // this is code to generate images for each page
    const generateImages = async () => {
        try {
            const newAiImages = [];
            for (let i = 0; i <= amountToGen; i++) {
                let prompt = PDF.summaries[i];

                console.log('generating images', i);
                console.log(isGenerating)

                if (prompt !== '') {
                    const image = await generate(prompt);
                    if (image === null || image.includes('Error generating image')) {
                        alert('Model seems to be down!');
                        break;
                    }
                    console.log("Generated image:");
                    setProgressValue((i / amountToGen) * 90);
                    newAiImages.push(image);
                }
            }
            create(PDF.rawtext, newAiImages, Title, FontName, FontSize);
        } catch (error) {
            console.error("Error in generateImages:", error);
        }
    };


    // to call set is generating to true to allow generation
    useEffect(() => {
        if (PDF && PDF.summaries && PDF.summaries.length > 0) {
            setIsGenerating(true)
            setProgressValue(0);
        }
    }, [PDF, forceUpdate]);

    // to begin generation of images depending on if its set to true or not
    useEffect(() => {
        if (isGenerating === true) {
            generateImages();
            returnStatus(isGenerating);
        }
        if (isGenerating === false) {
            returnStatus(isGenerating);
        }
    }, [isGenerating])


    // function to save the generated pdf
    const SavePDF = async () => {
        if (!pdfUrl) {
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
                formData.append('file', pdfBlob, `${Title}.pdf`);

                // Upload the file to Supabase Storage
                const { data, error } = await supabase
                    .storage
                    .from('illustrated-stories')
                    .upload(user.user.id + "/" + Title + " " + uuid(), pdfBlob, {
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
        <CContainer className="displayImage">
            <CContainer className="displayPDF">
                {isGenerating ? (
                    <CContainer className="progress-container">
                        <CProgress className="progress" color="info" variant="striped" animated value={progressValue}>
                            {progressValue < 80 ? (
                                <CProgressBar className="progress-bar">Generating Images!</CProgressBar>
                            ) : (
                                <CProgressBar className="progress-bar">Almost Done!</CProgressBar>
                            )}
                        </CProgress>
                    </CContainer>
                ) : (
                    pdfUrl ? (
                        <iframe
                            title="PDF Viewer"
                            src={pdfUrl}
                            style={{ width: '100%', height: '95%', border: 'none' }}
                        />
                    ) : (
                        <div className="empty_pdf">
                            Your illustrated story will be here...
                        </div>
                    )
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

export default DisplayImage;