import { CButton, CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect, useRef } from "react"
import axios from "axios";
import { pdfjs } from "react-pdf";
import './DisplayImage.css'

function DisplayImage({ pdf, storyTitle }) {

    const [pageNumber, setPageNumber] = useState(0);
    const [aiImages, setAiImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [PDF, SetPDF] = useState();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [Title, setStoryTitle] = useState(null);

    // grab the raw text
    const pages = PDF?.rawtext?.length;
    const page = PDF?.rawtext?.[pageNumber];

    useEffect(() => {
        // store pdf in local state to prevent losing images
        if (pdf) {
            SetPDF(pdf);
            setStoryTitle(storyTitle);
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

    const create = async (Text, Images, Title) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/createPDF", {
                text: Text,
                images: Images,
                title: Title
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer'
            });
            console.log(response);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    // this is code to generate images for each page
    const generateImages = async () => {
        try {
            const newAiImages = [];
            for (let i = 0; i <= 5; i++) {
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
                    newAiImages.push(image);
                }
            }

            setAiImages(newAiImages);
            create(PDF.rawtext, newAiImages, Title);
        } catch (error) {
            console.error("Error in generateImages:", error);
        }
    };


    // to call set is generating to true to allow generation
    useEffect(() => {
        if (PDF && PDF.summaries && PDF.summaries.length > 0) {
            setIsGenerating(true)
        }
    }, [PDF]);

    // to begin generation of images depending on if its set to true or not
    useEffect(() => {
        if (isGenerating === true) {
            generateImages();
        }
    }, [isGenerating])

    // const nextPage = () => {
    //     // turn next page but prevent from going if there is no more pages
    //     if (pageNumber === pages - 1) {
    //         return
    //     }
    //     setPageNumber(pageNumber + 1)
    // }

    // const prevPage = () => {
    //     // turn next page but prevent from going if there is no more pages
    //     if (pageNumber === 0) {
    //         return
    //     }
    //     setPageNumber(pageNumber - 1)
    // }

    return (
        <CContainer className="displayImage">

            {pdfUrl && (
                <iframe
                    title="PDF Viewer"
                    src={pdfUrl}
                    style={{ width: '100%', height: '95%', border: 'none' }}
                />
            )}

            {/* this is to display the PDF pages that was uploaded */}
            {/* <div className="firstpage" onClick={() => prevPage()}>
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
                    // display Loading while isGenerating is true
                    <div className="loading-spinner">
                        {isGenerating ? 'Loading...' : null}
                    </div>
                }
            </div> */}

        </CContainer>
    );
}

export default DisplayImage;