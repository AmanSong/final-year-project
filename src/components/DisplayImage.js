import { CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayImage.css'

function DisplayImage({ pdf }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [aiImages, setAiImages] = useState([]);

    // api to generate images
    const generate = async (prompt) => {
        try {
            const result = await axios.post(`http://127.0.0.1:8000/?prompt=${prompt}`);
            return result.data;
        } catch (error) {
            console.error("Error generating image:", error);
            return null; // or handle the error appropriately
        }
    };

    // grab the raw text
    const pages = pdf?.rawtext?.length;
    const page = pdf?.rawtext?.[pageNumber];
    let paragraphs;

    // loop through each summary and generate each image
    useEffect(() => {
        const generateImages = async () => {
            const generatedImages = [];
        
            for (let i = 0; i < 5; i++) {
                let prompt = pdf.summaries[i];
        
                console.log('generating images');
        
                if (prompt !== '') {
                    const image = await generate(prompt);
                    console.log("Generated image:", image);
                    generatedImages.push(image);
                } else {
                    generatedImages.push(null);
                }
            }
        
            // Update state once after all images are generated
            setAiImages(generatedImages);
        };

        if (pdf && pdf.summaries && pdf.summaries.length > 0) {
            generateImages();
        }
    }, [pdf]);


    // allow users to flip through the story
    if (page) {
        paragraphs = page.split('\n');
    } else {
        paragraphs = [];
    }

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
                {pdf?.images ? <img className="pdf" src={`data:image/png;base64,${pdf?.images?.[pageNumber]}`} alt="Base64 Image" draggable="false" /> : null}
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
                ) : null}
            </div>

        </CContainer>
    );
}

export default DisplayImage;