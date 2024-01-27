import { React, useEffect, useState } from "react"
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import './SavedStories.css'

function SavedStories() {

    // always make sure user is still authenticated
    const [currentUser, setCurrentUser] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const getUserName = async () => {
            const { data: user, error } = await supabase.auth.getUser();

            if (error) {
                console.log("Error fecthing user");
            }
            setCurrentUser(user);
        }
        getUserName();
    }, [])

    const addDataForCurrentUser = async () => {
        if (currentUser) {
          // Get the current user's ID
          const userId = currentUser.user.id;

          console.log(userId)
    
          // Your data to be added
          const newData = {
            // Link the data to the current user
            user_id: userId,
            data: 'testing 1 2 3',
          };
    
          // Add data to the 'user_data' table
          const { data, error } = await supabase.from('test_data').insert([newData]);
    
          if (error) {
            console.error('Error adding data:', error.message);
          } else {
            console.log('Data added successfully:', data);
          }
        }
      };

    return (
        <button onClick={addDataForCurrentUser}>Add Data</button>
    )
}

export default SavedStories