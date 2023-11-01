import { CContainer, CImage } from "@coreui/react";
import { React } from "react"

import './DisplayImage.css'

function DisplayImage({ image, pdf }) {

    const thirdPageText = pdf?.rawtext?.[3];

    return (
        <CContainer className="displayImage">

            <div className="firstpage">
                {thirdPageText}
            </div>

            <div className="secondpage">
                {image ?
                    <CImage className="image" src={`data:image/png;base64,${image}`}></CImage> : null
                }
            </div>


        </CContainer>
    );
}

export default DisplayImage;
