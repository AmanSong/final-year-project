import { React, useState, useEffect, useCallback, useRef } from 'react'
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { CButton, CCollapse, CCard, CCardBody, CImage, CCardTitle } from '@coreui/react';
import './UserMenu.css'
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

function UserMenu() {

    const [currentUser, setCurrentUser] = useState('');
    const [userPicture, setUserPicture] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentUserName, setCurrentUserName] = useState('');
    const menuRef = useRef(null);

    const navigate = useNavigate();

    // Check local storage for cached user details
    const cachedUserDetails = JSON.parse(localStorage.getItem('userDetails'));

    useEffect(() => {

        const getUserDetails = async () => {

            try {
                const { data: user, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    console.error('Error fetching user:', userError.message);
                    return;
                }
                
                if (cachedUserDetails.userId === user.user.id) {
                    setCurrentUser(cachedUserDetails.userId);
                    setUserPicture(cachedUserDetails.userPicture);
                    setCurrentUserName(cachedUserDetails.user_name);
                } else {

                    if (user.user.id) {
                        setCurrentUser(user.user.id);
                        setCurrentUserName(user.user.user_metadata.user_name)

                        // Fetch user images
                        const { data: images, error: imageError } = await supabase
                            .storage
                            .from('user-profile-picture')
                            .list(currentUser + '/');

                        if (imageError) {
                            console.error('Error fetching images:', imageError.message);
                            return;
                        }

                        const pfp_pic = images[1].name;

                        // Update local storage with the new user details
                        localStorage.setItem('userDetails', JSON.stringify({
                            userId: user.user.id,
                            userPicture: pfp_pic,
                            userName: user.user.user_metadata.user_name,
                        }));

                        setUserPicture(pfp_pic);
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error.message);
            }
        };

        getUserDetails();
    }, [currentUser]);


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
            // Delete current profile picture
            const { error: deleteError } = await supabase
                .storage
                .from('user-profile-picture')
                .remove(currentUser + "/" + userPicture);

            if (deleteError) {
                console.error('Error deleting current profile picture:', deleteError);
                return;
            }

            // Upload file to Supabase Bucket
            const { data, error } = await supabase
                .storage
                .from('user-profile-picture')
                .upload(currentUser + "/" + uuid(), image, {
                    contentType: contentType,
                });

            // clear cache
            const keyToRemove = 'userDetails';
            localStorage.removeItem(keyToRemove);

            window.location.reload();

        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }, [currentUser, userPicture, setCurrentUser]);

    const { open } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        },
    });

    function changeProfilePic() {
        open();
    }

    // Handle menu opening and to close when user clicks outside
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickInside = (event) => {
        event.stopPropagation();
    };

    return (
        <div className='menu-section' onClick={handleClickInside}>
            <CButton className='menu-button' onClick={() => setMenuVisible(!menuVisible)}>
                <img src={`https://nxvblpqurqlefmvialip.supabase.co/storage/v1/object/public/user-profile-picture/${currentUser}/${userPicture}`} alt="Button Icon" />
            </CButton>
            <CCollapse visible={menuVisible}>
                <CCard className={`menu-dropdown ${menuVisible ? 'show' : ''}`} ref={menuRef} >

                    <CCardBody className='menu-buttons'>
                        <CCard className='profile-picture'>
                            <CImage
                                className="pfp-image"
                                src={`https://nxvblpqurqlefmvialip.supabase.co/storage/v1/object/public/user-profile-picture/${currentUser}/${userPicture}`}
                                onClick={() => changeProfilePic()}
                                onError={(e) => {
                                    console.error("Error loading image:");
                                }}
                            ></CImage>
                            <CCardTitle className='user-name'>{currentUserName}</CCardTitle>
                        </CCard>

                        <CButton className='create-stories-button' onClick={() => CreateStories()}>Create and Illustrate</CButton>
                        <CButton className='saved-stories-button' onClick={() => ViewStories()}>Library</CButton>
                        <CButton className='signout-button' onClick={() => SignOut()}>Sign Out      <CIcon icon={icon.cilAccountLogout} /></CButton>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    )
}

export default UserMenu