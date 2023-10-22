import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from "@coreui/react";
import { React } from "react"

import './SelectModel.css'

function SelectModel({ selectedModel }) {

    const dropdownSelect = (value) => {
        selectedModel(value)
    };

    return (
        <CDropdown className="dropdown">
            <CDropdownToggle className="dropdown-toggle">Dropdown button</CDropdownToggle>
            <CDropdownMenu className="drop-menu">
                <CDropdownItem className="drop-item" onClick={() => dropdownSelect('stable-diffusion-xl-base-1.0')}>stable-diffusion-xl-base-1.0</CDropdownItem>
                <CDropdownItem className="drop-item" onClick={() => dropdownSelect('CompVis/stable-diffusion-v1-4')}>CompVis/stable-diffusion-v1-4</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    );
}

export default SelectModel;
