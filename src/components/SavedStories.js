import { React, useEffect, useState } from "react"
import supabase from '../config/SupabaseClient';
import './SavedStories.css'
import { CHeader, CButton } from '@coreui/react';
import UserMenu from "./UserMenu";
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import DisplaySaved from "./DisplaySaved";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';


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
    const [thumbnails, setThumbnails] = useState([]);
    const [loadingThumbnails, setLoadingThumbnails] = useState(Array(userStories.length).fill(true));
    const [openViewer, setOpenViewer] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);


    const captureThumbnail = async (pdf, index) => {
        try {
            const page = await pdf.getPage(1); // Assuming you want the first page
            const viewport = page.getViewport({ scale: 0.5 }); // Adjust the scale as needed

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
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    console.log(thumbnails);

    const viewPDF = (pdf) => {
        setOpenViewer(true);
        setSelectedPDF(pdf);
    };
    const closeViewer = () => {
        setOpenViewer(false);
        setSelectedPDF(null);
    };

    // npm install react-pdf

    console.log(userStories)

    return (
        <div className="saved-stories-section">
            <CHeader className="main-header">
                <h4 id="p-title">Good to see you, {currentUserName}</h4>
                <UserMenu />
            </CHeader>

            {openViewer
                ?
                <DisplaySaved pdfContent={selectedPDF} closeViewer={closeViewer}></DisplaySaved>
                :
                null
            }

            <div className="saved-stories">
                <div className="saved-stories-container">
                    {userStories.map((story, index) => (
                        <div key={index}>
                            <Document file={story.content} onLoadSuccess={(pdf) => captureThumbnail(pdf, index)}>
                                <div onClick={() => { viewPDF(story.content); setSelectedPDF(story.content); }} className="pdf-thumbnail-container">
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

        </div>
    );

}

export default SavedStories