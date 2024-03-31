import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import supabase from "./config/SupabaseClient";

const SecureRoute = () => {
    const [auth, setAuthentication] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: user, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Error checking authentication:', error.message);
                    setAuthentication(false);
                    return;
                }
                if (user && user.user.role === 'authenticated') {
                    console.log('Authenticated');
                    setAuthentication(true);
                } else {
                    console.log('Not authenticated');
                    setAuthentication(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error.message);
                setAuthentication(false);
            }
        };
        checkAuth();
    }, []);
    if (auth === null) {
        return null;
    } else if (auth) {
        return <Outlet />;
    } else {
        return <Navigate to="/" />;
    }
};

export default SecureRoute;
