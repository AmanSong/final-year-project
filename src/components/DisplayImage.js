import { CContainer, CImage } from "@coreui/react";
import { React } from "react"

import './DisplayImage.css'

function DisplayImage({ image }) {

    return (
        <CContainer className="displayImage">
            {image ?
                <CImage className="image" src={`data:image/png;base64,${image}`}></CImage> : null
            }

        </CContainer>
    );
}

export default DisplayImage;
