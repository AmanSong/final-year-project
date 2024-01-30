import { React, useEffect, useState } from "react"
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import './SavedStories.css'
import { CHeader, CForm, CFormTextarea, CButton, CImage } from '@coreui/react';
import UserMenu from "./UserMenu";
import axios from "axios";
import { decode } from 'base64-arraybuffer'
import { v4 as uuid } from "uuid";


function SavedStories() {

    // always make sure user is still authenticated
    const [currentUser, setCurrentUser] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [userImages, setUserImages] = useState([])

    const navigate = useNavigate();

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

                // Fetch images only if userId is available
                if (user.user.id) {
                    const { data, error: imageError } = await supabase
                        .storage
                        .from('illustrated-stories')
                        .list(user.user.id + "/");

                    if (imageError) {
                        console.error('Error fetching images:', imageError.message);
                        return;
                    }

                    setUserImages(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []); // Empty dependency array to ensure this runs only once on mount


    // const addDataForCurrentUser = async () => {
    //     if (currentUser) {
    //         // Get the current user's ID
    //         const userId = currentUser.user.id;

    //         console.log(userId)

    //         // Your data to be added
    //         const newData = {
    //             // Link the data to the current user
    //             user_id: userId,
    //             data: 'testing 1 2 3',
    //         };

    //         // Add data to the 'user_data' table
    //         const { data, error } = await supabase.from('test_data').insert([newData]);

    //         if (error) {
    //             console.error('Error adding data:', error.message);
    //         } else {
    //             console.log('Data added successfully:', data);
    //         }
    //     }
    // };


    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState();

    // api to generate images and save to supabase
    const generate = async (prompt) => {
        try {
            alert(prompt);
            const result = await axios.post(`http://127.0.0.1:8000/?prompt=${prompt}`);
            console.log(result)

            // Use the base64-encoded image directly
            const image = result.data;
            console.log(image)
            const binaryData = decode(image);
            setImage(image)

            // Upload file to Supabase Bucket
            const { data, error } = await supabase
                .storage
                .from('illustrated-stories')
                .upload(userId + "/" + uuid(), binaryData, {
                    // Specify the content type as 'image/png' since it's a PNG image
                    contentType: 'image/png',
            });

            // add data to link to test data table
            const newData = {
                user_id: userId,
                data: `user-files/${userId}/${prompt}`,
            };
            const { res, error1 } = await supabase.from('test_data').insert([newData]);
            if (error1) {
                console.error('Error adding data:', error1.message);
            } else {
                console.log('Data added successfully:');
            }
            console.log('File uploaded and user data added');


            return result.data;

        } catch (error) {
            console.error("Something went wrong: ", error);
            return null;
        }
    };

    console.log(userImages)

    return (
        <div className="saved-stories-section">
            <CHeader className="main-header">
                <h4 id="p-title">Good to see you, {currentUserName}</h4><UserMenu />
            </CHeader>

            <div className="saved-stories">

                <div className="test">
                    <CForm className="form-input">
                        <CFormTextarea
                            label="Generate an image (Testing Purposes)"
                            placeholder="A golden goose on a farm"
                            rows={2}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </CForm>
                    <CButton className="style-button" onClick={() => generate(prompt)}>Submit</CButton>
                </div>

                <div className="image-container">
                    {userImages.slice(1).map((image) => (
                        <div key={image.name} className="image-item">
                            <img
                                src={`https://nxvblpqurqlefmvialip.supabase.co/storage/v1/object/public/illustrated-stories/${userId}/${image.name}`}
                                alt={image.name}
                                className="image-thumbnail"
                            />
                        </div>
                    ))}
                </div>


            </div>
        </div>
    )
}

export default SavedStories