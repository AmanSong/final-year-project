import { CContainer, CImage } from "@coreui/react";
import { React, useState, useEffect } from "react"
import axios from "axios";
import './DisplayStory.css'

function DisplayStory({ story }) {

    const [Story, SetStory] = useState('')

    useEffect(() => {
        SetStory(story?.[0])
    }, [story])

    const paragraphs = Story.split('\n\n');

    const [pageNumber, setPageNumber] = useState(0);
    const [aiImages, setAiImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // // api to generate images
    // const generate = async (prompt) => {
    //     try {
    //         const result = await axios.post(`http://127.0.0.1:8000/?prompt=${prompt}`);
    //         return result.data;
    //     } catch (error) {
    //         console.error("Something went wrong: ", error);
    //         return null;
    //     }
    // };

    // const generateImages = async () => {
    //     setIsGenerating(true)
    //     for (let i = 0; i < 25; i++) {
    //         let prompt = pdf.summaries[i];

    //         console.log('generating images', i);

    //         if (prompt !== '') {
    //             const image = await generate(prompt);
    //             console.log("Generated image:", image);

    //             // Update state with the new image as soon as it is generated
    //             setAiImages((prevImages) => {
    //                 const newImages = [...prevImages];
    //                 newImages[i] = image;
    //                 return newImages;
    //             });
    //         } else {
    //             // Update state with null for empty prompts
    //             setAiImages((prevImages) => {
    //                 const newImages = [...prevImages];
    //                 newImages[i] = null;
    //                 return newImages;
    //             });
    //         }
    //     }

    //     setIsGenerating(false)
    // };

    // useEffect(() => {
    //     if (pdf && pdf.summaries && pdf.summaries.length > 0) {
    //         generateImages();
    //     }
    // }, [pdf]);


    // // allow users to flip through the story
    // if (page) {
    //     paragraphs = page.split('\n');
    // } else {
    //     paragraphs = [];
    // }

    // const nextPage = () => {
    //     // turn next page but prevent from going if there is no more pages
    //     if (pageNumber == pages) {
    //         return
    //     }
    //     setPageNumber(pageNumber + 1)
    // }

    // const prevPage = () => {
    //     if (pageNumber === 0) {
    //         return
    //     }
    //     setPageNumber(pageNumber - 1)
    // }
    console.log(Story)
    return (
        <CContainer className="story-displayImage">

            <div className="story-firstpage">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>
                        {paragraph}
                    </p>
                ))}
            </div>

            <div className="story-secondpage">

            </div>

        </CContainer>
    );
}

export default DisplayStory;