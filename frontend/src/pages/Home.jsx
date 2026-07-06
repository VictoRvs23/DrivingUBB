import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { AiOutlineHome } from "react-icons/ai";

import HomeAlumno from '../pages/HomeAlumno';
import HomeInstructor from '../pages/HomeInstructor';
import HomeSecreAdmin from '../pages/HomeSecreAdmin';

import '../styles/Home.css'; 

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="main-container">
            <Sidebar />

            <div className="home-page">
                <div className="home-header">
                    <h1><AiOutlineHome className="title-icon"/> Inicio</h1>
                </div>

                <div className="home-card-container">
                    {(user?.role === 'admin' || user?.role === 'secretaria') 
                        ? <HomeSecreAdmin /> 
                        : user?.role === 'instructor' 
                            ? <HomeInstructor /> 
                            : <HomeAlumno />
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;