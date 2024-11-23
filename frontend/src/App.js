import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddData from './components/AddData';
import ViewData from './components/ViewData';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignIn/SignUp';
import Cards from './components/Cards';
import Landing from './components/Landing/Landing';
import Services from './components/Landing/Services';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return children;
};

const App = () => {
    const [currentPage, setCurrentPage] = useState('calendar');
    const [selectedDate, setSelectedDate] = useState(null);

    // Update CSS variables for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 50; // Adjust intensity
            const yPos = (e.clientY / window.innerHeight - 0.5) * 50;

            document.documentElement.style.setProperty('--xPos', `${xPos}px`);
            document.documentElement.style.setProperty('--yPos', `${yPos}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleAddData = () => {
        if (selectedDate) {
            setCurrentPage('addData');
        }
    };

    const handleViewData = () => {
        setCurrentPage('viewData');
    };

    const handleScroll = () => {
        setCurrentPage('cards');
    };

    return (
        <div className="app">
            <div className="parallax-background"></div> {/* Parallax background */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />

                <Route 
                    path="/diary" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar setCurrentPage={setCurrentPage} />
                                <div className="content">
                                    {currentPage === 'calendar' && (
                                        <AddData 
                                            setCurrentPage={setCurrentPage}
                                            setSelectedDate={setSelectedDate}
                                            selectedDate={selectedDate}
                                            handleAddData={handleAddData}
                                            handleViewData={handleViewData}
                                            handleScroll={handleScroll}
                                        />
                                    )}
                                    {currentPage === 'viewdata' && (
                                        <ViewData
                                            selectedDate={selectedDate}
                                            setCurrentPage={setCurrentPage} 
                                        />
                                    )}
                                    {currentPage === 'cards' && (
                                        <Cards
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    )}
                                </div>
                            </>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
