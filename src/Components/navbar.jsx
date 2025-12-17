import { Link } from 'react-router-dom';
import logo from '../assets/user.png';
import '../Pages/Landpage.css';
import React, { useEffect, useState } from 'react';
import { getAuthState } from '../context/AuthState';

export default function Navbar(){
    const [{ userType }, setLocalAuth] = useState(getAuthState());

    useEffect(() => {
        const handler = () => setLocalAuth(getAuthState());
        window.addEventListener('auth-changed', handler);
        return () => window.removeEventListener('auth-changed', handler);
    }, []);
    return (
        <div>
            <div className="landpage">
                <div className="header">
                    <Link to={'/'} className="header">Able-Ease</Link>
                </div>
                <div className="bars">
                    <Link to="/home">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/about">Organizations</Link>
                    <Link to="/about">Physiotherapy</Link>
                    {userType === 'admin' && (
                    <Link to="/admin-profile" style={{ color: '#059669', fontWeight: 700 }}>Admin</Link>
                    )}
                    <button className="land-btn">
                        <img className="logo-img" src={logo} alt="user-logo"></img>
                        Join US
                    </button>
                </div>
            </div>
        </div>
    )
}