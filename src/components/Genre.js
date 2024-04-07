import { React, useState, useEffect } from "react"
import { CButton, CCard, CCollapse, CForm, CFormInput } from "@coreui/react";
import './Genre.css'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';


function Genre({ onGenresSelected }) {
    const [visible, setVisible] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [highlightedGenres, setHighlightedGenres] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [customGenre, setCustomGenre] = useState('');

    const flipArrow = () => {
        setIsFlipped(!isFlipped);
    };

    const toggleGenre = (value) => {
        // Check if the genre is already selected
        if (selectedGenres.includes(value)) {
            // If selected, remove it from the selectedGenres array
            setSelectedGenres(selectedGenres.filter((genre) => genre !== value));
        } else {
            // If not selected, add it to the selectedGenres array
            setSelectedGenres([...selectedGenres, value]);
        }

        // Toggle highlight for the clicked genre
        setHighlightedGenres((prevHighlightedGenres) =>
            prevHighlightedGenres.includes(value)
                ? prevHighlightedGenres.filter((genre) => genre !== value)
                : [...prevHighlightedGenres, value]
        );
    };

    const handleCustomGenreChange = (event) => {
        setCustomGenre(event.target.value);
    };

    const addCustomGenre = (event) => {
        if(customGenre !== '') {
            setSelectedGenres([...selectedGenres, customGenre.trim()]);
        }
    };

    useEffect(() => {
        if (onGenresSelected) {
            onGenresSelected(selectedGenres);
        }
    }, [selectedGenres, onGenresSelected]);

    return (
        <div className="genre-container">
            <CButton className="styledrop-button" onClick={() => { setVisible(!visible); flipArrow() }}>
                Select Genre
                <CIcon className={`button-icon ${isFlipped ? 'flipped' : ''}`} icon={icon.cilChevronBottom} size="xl" />
            </CButton>
            <CCollapse visible={visible}>
                <CCard className="genre-card">
                    <CButton onClick={() => toggleGenre('Action')} className={`genre-button ${highlightedGenres.includes('Action') ? 'high-lighted' : ''}`}>
                        Adventure
                    </CButton>
                    <CButton onClick={() => toggleGenre('Fantasy')} className={`genre-button ${highlightedGenres.includes('Fantasy') ? 'high-lighted' : ''}`}>
                        Fantasy
                    </CButton>
                    <CButton onClick={() => toggleGenre('Romance')} className={`genre-button ${highlightedGenres.includes('Romance') ? 'high-lighted' : ''}`}>
                        Romance
                    </CButton>
                    <CButton onClick={() => toggleGenre('Comedy')} className={`genre-button ${highlightedGenres.includes('Comedy') ? 'high-lighted' : ''}`}>
                        Comedy
                    </CButton>
                    <CButton onClick={() => toggleGenre('Mystery')} className={`genre-button ${highlightedGenres.includes('Mystery') ? 'high-lighted' : ''}`}>
                        Mystery
                    </CButton>
                    <CForm>
                        <CFormInput
                            className="custom-genre-button"
                            placeholder="Other..."
                            value={customGenre}
                            onChange={handleCustomGenreChange}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    addCustomGenre();
                                }
                            }}
                        ></CFormInput>
                    </CForm>
                </CCard>
            </CCollapse>
        </div>
    );
}

export default Genre;
