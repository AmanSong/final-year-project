import { CButton, CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayImage.css'

function DisplayImage({ pdf }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [aiImages, setAiImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [PDF, SetPDF] = useState();

    // grab the raw text
    const pages = PDF?.rawtext?.length;
    const page = PDF?.rawtext?.[pageNumber];

    useEffect(() => {
        // store pdf in local state to prevent losing images
        if (pdf) {
            SetPDF(pdf);
            console.log(pdf)
        }
    }, [pdf]);


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

    const generateImages = async () => {
        setIsGenerating(true)
        for (let i = 0; i < pages; i++) {
            let prompt = PDF.summaries[i];

            console.log('generating images', i);

            if (prompt !== '') {
                const image = await generate(prompt);
                console.log("Generated image:", image);

                // Update state with the new image as soon as it is generated
                setAiImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[i] = image;
                    return newImages;
                });
            } else {
                // Update state with null for empty prompts
                setAiImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[i] = null;
                    return newImages;
                });
            }
        }

        setIsGenerating(false)
    };

    useEffect(() => {
        if (PDF && PDF.summaries && PDF.summaries.length > 0) {
            generateImages();
        }
    }, [PDF]);


    const nextPage = () => {
        // turn next page but prevent from going if there is no more pages
        if (pageNumber === pages-1) {
            return
        }
        setPageNumber(pageNumber + 1)
    }

    const prevPage = () => {
        // turn next page but prevent from going if there is no more pages
        if (pageNumber === 0) {
            return
        }
        setPageNumber(pageNumber - 1)
    }
    return (
        <CContainer className="displayImage">

            <div className="firstpage" onClick={() => prevPage()}>
                {PDF?.images ? <img className="pdf" src={`data:image/png;base64,${PDF?.images?.[pageNumber]}`} alt="Base64 Image" draggable="false" /> : null}
            </div>

            <div className="secondpage" onClick={() => nextPage()}>
                {aiImages[pageNumber] ? (
                    <CImage
                        className="image"
                        src={`data:image/png;base64,${aiImages[pageNumber]}`}
                        onError={(e) => {
                            console.error("Error loading image:", e);
                            // Handle the error or set a placeholder image
                        }}
                    ></CImage>
                ) :
                    <div className="loading-spinner">
                        {isGenerating ? 'Loading...' : null}
                    </div>
                }
                <CButton className="stopButton">Stop</CButton>
            </div>

        </CContainer>
    );
}

export default DisplayImage;