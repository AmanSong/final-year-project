import { React, useState, useEffect, useCallback } from 'react'
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { CButton, CCollapse, CCard, CCardBody, CImage } from '@coreui/react';
import './UserMenu.css'
import { useDropzone } from "react-dropzone";
import { decode } from 'base64-arraybuffer'
import { v4 as uuid } from "uuid";
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

function UserMenu() {

    const [currentUser, setCurrentUser] = useState('');
    const [userPicture, setUserPicture] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const { data: user, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    console.error("Error fetching user:", userError.message);
                    return;
                }

                if (user.user.id) {
                    setCurrentUser(user.user.id);

                    // Fetch user images
                    const { data: images, error: imageError } = await supabase
                        .storage
                        .from('user-profile-picture')
                        .list(currentUser + "/");

                    if (imageError) {
                        console.error('Error fetching images:', imageError.message);
                        return;
                    }

                    setUserPicture(images[1].name);
                }
            } catch (error) {
                console.error('Error fetching user details:', error.message);
            }
        };

        getUserDetails();
    }, [currentUser]);  // Dependency array updated to include currentUser

    useEffect(() => {
        console.log('User picture updated:', userPicture);
    }, [userPicture]);



    function SignOut() {
        const signingOut = async () => {
            let { error } = await supabase.auth.signOut()

            if (error) {
                console.log('ERROR SIGNING USER OUT')
            }

            navigate('/')
        }
        signingOut();
    }

    function ViewStories() {
        navigate('/main/savedStories');
    }

    function CreateStories() {
        navigate('/main');
    }

    const onDrop = useCallback(async (acceptedImage) => {
        const image = acceptedImage[0];
        const contentType = image.type === 'image/png' ? 'image/png' : 'image/jpeg';
        try {
            // Upload file to Supabase Bucket
            const { data, error } = await supabase
                .storage
                .from('user-profile-picture')
                .upload(currentUser + "/" + uuid(), image, {
                    contentType: contentType,
                });

        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }, [currentUser]);
    const { open } = useDropzone({
        onDrop,
        accept: '.png .jpg',
    });
    function changeProfilePic() {
        open();
    }

    return (
        <div className='menu-section'>
            <CButton className='menu-button' onClick={() => setMenuVisible(!menuVisible)}>
                <img src={`https://nxvblpqurqlefmvialip.supabase.co/storage/v1/object/public/user-profile-picture/${currentUser}/${userPicture}`} alt="Button Icon" />
            </CButton>
            <CCollapse visible={menuVisible}>
                <CCard className='menu-dropdown'>

                    <CCardBody className='menu-buttons'>
                        <CCard className='profile-picture'>
                            <CImage
                                className="pfp-image"
                                src={`https://nxvblpqurqlefmvialip.supabase.co/storage/v1/object/public/user-profile-picture/${currentUser}/${userPicture}`}
                                onClick={() => changeProfilePic()}
                                onError={(e) => {
                                    console.error("Error loading image:", e);
                                }}
                            ></CImage>
                        </CCard>
                        
                        <CButton className='create-stories-button' onClick={() => CreateStories()}>Create and Illustrate</CButton>
                        <CButton className='saved-stories-button' onClick={() => ViewStories()}>View Saved Stories</CButton>
                        <CButton className='signout-button' onClick={() => SignOut()}>Sign Out      <CIcon icon={icon.cilAccountLogout} /></CButton>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    )
}

export default UserMenu