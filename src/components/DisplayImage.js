import { CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayImage.css'

function DisplayImage({ image, pdf }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [aiImages, setAiImages] = useState([]);

    // api to generate images
    const generate = async (prompt) => {
        const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
        return result.data;
    };

    // grab the raw text
    const pages = pdf?.rawtext?.length;
    const page = pdf?.rawtext?.[pageNumber];
    let paragraphs;


    // loop through each summary and generate each image
    // useEffect(() => {
    //     const generateImages = async () => {
    //         const images = [];
    //         for (let i = 0; i < 3; i++) {
    //             let prompt = pdf.summaries[i];
    //             if (prompt !== '') {
    //                 const image = await generate(prompt);
    //                 images.push(image);
    //                 setAiImages([...images]); // Update state after each image is generated
    //             } else {
    //                 images.push(null);
    //             }
    //         }
    //         setPdfLoaded(true);
    //     };
    
    //     if (pdf && pdf.summaries && pdf.summaries.length > 0) {
    //         generateImages();
    //     }
    // }, [pdf]);


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
                <img src={`data:image/png;base64,${pdf?.images?.[pageNumber]}`} alt="Base64 Image" />
            </div>

            <div className="secondpage" onClick={() => nextPage()}>
                {aiImages[pageNumber] ? (
                    <CImage className="image" src={`data:image/png;base64,${aiImages[pageNumber]}`}></CImage>
                ) : null}
            </div>


        </CContainer>
    );
}

export default DisplayImage;