import { CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayImage.css'

function DisplayImage({ pdf }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [aiImages, setAiImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [PDF, SetPDF] = useState();

    useEffect(() => {
        // store pdf in local state to prevent losing images
        if (pdf) {
            SetPDF(pdf);
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

    // grab the raw text
    const pages = pdf?.rawtext?.length;
    const page = pdf?.rawtext?.[pageNumber];
    //let paragraphs;

    const generateImages = async () => {
        setIsGenerating(true)
        for (let i = 0; i < 2; i++) {
            let prompt = pdf.summaries[i];

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

        if (pdf && pdf.summaries && pdf.summaries.length > 0) {
            generateImages();
        }
    }, [pdf]);


    // allow users to flip through the story
    // if (page) {
    //     paragraphs = page.split('\n');
    // } else {
    //     paragraphs = [];
    // }

    const nextPage = () => {
        // turn next page but prevent from going if there is no more pages
        if (pageNumber == pages) {
            return
        }
        setPageNumber(pageNumber + 1)
    }

    const prevPage = () => {
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
            </div>

        </CContainer>
    );
}

export default DisplayImage;