import { CContainer, CImage } from "@coreui/react";
import { React, useState } from "react"

import './DisplayImage.css'

function DisplayImage({ image, pdf }) {

    const [pageNumber, setPageNumber] = useState(0);

    const page = pdf?.rawtext?.[pageNumber];
    let paragraphs;

    if (page) {
        paragraphs = page.split('\n');
    } else {
        paragraphs = [];
    }

    const pageForward = () => {
        setPageNumber(pageNumber + 1)
    }

    const pageBackward = () => {
        if (pageNumber === 0) {
            return
        }
        setPageNumber(pageNumber - 1)
    }

    return (
        <CContainer className="displayImage">

            <div className="firstpage" onClick={() => pageBackward()}>
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="secondpage" onClick={() => pageForward()}>
                {image ?
                    <CImage className="image" src={`data:image/png;base64,${image}`}></CImage> : null
                }
            </div>


        </CContainer>
    );
}

export default DisplayImage;
