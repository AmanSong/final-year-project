import { React, useEffect, useState, useRef } from "react"
import supabase from '../config/SupabaseClient';
import './SavedStories.css'
import { CNavbar, CNavbarBrand, CToast, CToastHeader, CToaster } from '@coreui/react';
import UserMenu from "./UserMenu";
import { pdfjs } from 'react-pdf';
import { Document } from 'react-pdf';
import DisplaySaved from "./DisplaySaved";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

function SavedStories() {

    // always make sure user is still authenticated
    const [currentUser, setCurrentUser] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [userStories, setStories] = useState([]);
    const [userStoriesDetails, setStoriesDetails] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [loadingThumbnails, setLoadingThumbnails] = useState(Array(userStories.length).fill(true));
    const [openViewer, setOpenViewer] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [selectedPDFdetails, setSelectedPDFdetails] = useState(null);

    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const [forceUpdate, setForceUpdate] = useState(false);

    const toastDelete = (
        <CToast>
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">Successfully deleted</div>
            </CToastHeader>
        </CToast>
    )

    const navigate = useNavigate();

    const captureThumbnail = async (pdf, index) => {
        try {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 }); 

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
            const thumbnailUrl = canvas.toDataURL('image/jpeg');

            // Update the thumbnails state with the correct index
            setThumbnails((prevImages) => {
                const newThumbnails = [...prevImages];
                newThumbnails[index] = thumbnailUrl;
                return newThumbnails;
            });
        } catch (error) {
            console.error('Error capturing thumbnail:', error.message);
        } finally {
            // Set loading to false for the corresponding index
            setLoadingThumbnails((prevLoading) => {
                const newLoading = [...prevLoading];
                newLoading[index] = false;
                return newLoading;
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: user, error } = await supabase.auth.getUser();

                if (error) {
                    console.log("Error fetching user");
                    return;
                }

                setCurrentUser(user);
                setCurrentUserName(user.user.user_metadata.user_name);
                setUserId(user.user.id);

                if (user.user.id) {
                    const { data, error: imageError } = await supabase
                        .storage
                        .from('illustrated-stories')
                        .list(user.user.id + "/");

                    if (imageError) {
                        console.error('Error fetching images:', imageError.message);
                        return;
                    }

                    const filteredData = data.slice(1);

                    // Download PDF documents
                    const stories = await Promise.all(
                        filteredData.map(async (file) => {
                            const { data, error } = await supabase
                                .storage
                                .from('illustrated-stories')
                                .download(user.user.id + "/" + file.name);

                            if (error) {
                                console.error('Error downloading file:', error.message);
                                return null;
                            }

                            return { name: file.name, content: data };
                        })
                    );

                    setStories(stories.filter(Boolean));
                    setStoriesDetails(filteredData);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [forceUpdate]);

    const viewPDF = (pdf, detail) => {
        setOpenViewer(true);
        setSelectedPDF(pdf);
        setSelectedPDFdetails(detail);
    };
    const closeViewer = () => {
        setOpenViewer(false);
        setSelectedPDF(null);
    };

    const Delete = async () => {
        try {
            const { data, error } = await supabase
                .storage
                .from('illustrated-stories')
                .remove(userId + "/" + selectedPDFdetails.name);

            if (error) {
                console.error('Error deleting story:', error);
                return;
            }

            console.log('Deleted successfully');
            addToast(toastDelete)
            setForceUpdate(prevState => !prevState);
        } catch (error) {
            console.error('Unexpected error during deletion:', error);
        }
    }


    const Return = () => {
        navigate('/main')
    }

    // npm install react-pdf

    return (
        <div className="saved-stories-section">
            <CNavbar className="main-header">
                <CNavbarBrand className="brand">
                    <img onClick={() => Return()} className="logo" src="/logo.png" alt="Ai Illustrator" />
                </CNavbarBrand> 
                <UserMenu />
            </CNavbar >

            {openViewer
                ?
                <DisplaySaved pdfContent={selectedPDF} pdfDetail={selectedPDFdetails} closeViewer={closeViewer} Delete={Delete}></DisplaySaved>
                :
                null
            }

            <div className="saved-stories">

                <div className="saved-stories-header">
                    <h4>Saved Stories</h4>
                </div>

                <div className="saved-stories-container">
                    {userStories.map((story, index) => (
                        <div key={index}>
                            <Document file={story.content} onLoadSuccess={(pdf) => captureThumbnail(pdf, index)}>
                                <div onClick={() => { viewPDF(story.content, userStoriesDetails[index]) }} className="pdf-thumbnail-container">
                                    {loadingThumbnails[index] ? (
                                        <p>Loading Thumbnail...</p>
                                    ) : (
                                        <img className="thumbnail" src={thumbnails[index]} alt={`Thumbnail ${index}`} />
                                    )}
                                </div>
                            </Document>
                        </div>
                    ))}
                </div>
            </div>

            <CToaster ref={toaster} push={toast} placement="top" />

        </div>
    );

}

export default SavedStories