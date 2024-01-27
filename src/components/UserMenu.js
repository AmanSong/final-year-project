import { React, useState, useEffect } from 'react'
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { CButton, CCollapse, CCard, CCardBody } from '@coreui/react';
import './UserMenu.css'

function UserMenu() {

    const [currentUser, setCurrentUser] = useState('');
    const [menuVisible, setMenuVisible] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const getUserName = async () => {
            const { data: user, error } = await supabase.auth.getUser();

            if (error) {
                console.log("Error fecthing user");
            }
            setCurrentUser(user.user.user_metadata.user_name);
        }
        getUserName();
    }, [])

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

    return (
        <div className='menu-section'>
            <CButton className='menu-button' onClick={() => setMenuVisible(!menuVisible)}>{currentUser}</CButton>
            <CCollapse visible={menuVisible}>
                <CCard className='menu-dropdown'>
                    <CCardBody className='menu-buttons'>
                        <CButton className='saved-stories-button' onClick={() => ViewStories()}>View Saved Stories</CButton>
                        <CButton className='signout-button' onClick={() => SignOut()}>Sign Out</CButton>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </div>
    )
}

export default UserMenu