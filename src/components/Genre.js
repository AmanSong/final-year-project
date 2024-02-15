import { React, useState, useEffect } from "react"
import { CButton, CCard, CCollapse, CContainer } from "@coreui/react";
import './Genre.css'

function Genre({ onGenresSelected }) {
    const [visible, setVisible] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [highlightedGenres, setHighlightedGenres] = useState([]);

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

    useEffect(() => {
        if (onGenresSelected) {
            onGenresSelected(selectedGenres);
        }
    }, [selectedGenres, onGenresSelected]);

    return (
        <div className="genre-container">
            <CButton className="open-genre" onClick={() => setVisible(!visible)}>Select Genre</CButton>
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
                </CCard>
            </CCollapse>
        </div>
    );
}

export default Genre;
