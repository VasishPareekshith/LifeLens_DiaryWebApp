import React, { useState } from 'react';

const Navbar = ({ setCurrentPage }) => {
    const handleNavigation = (page) => {
        setCurrentPage(page);
    };
    const [hoveredButton, setHoveredButton] = useState(null);
    const handleMouseEnter = (button) => {
        setHoveredButton(button);
    };
    const handleMouseLeave = () => {
        setHoveredButton(null);
    };
    const handleSignOut = () => {
        localStorage.clear();
        window.location.href = "/";
    };
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '80px', // Set a fixed height
            display: 'flex',
            justifyContent: 'space-between', // Space between the buttons
            alignItems: 'center',
            backgroundColor: 'black',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow for visibility
            zIndex: 1000
        }}>
            <div style={lifelens}>
                LifeLens
            </div>
            
            {/* Right-side container for the rest of the buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    onClick={() => handleNavigation('calendar')}
                    style={hoveredButton === 'calendar' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                    onMouseEnter={() => handleMouseEnter('calendar')}
                    onMouseLeave={handleMouseLeave}
                >
                    WRITE
                </div>
                <div
                    onClick={() => handleNavigation('cards')}
                    style={hoveredButton === 'cards' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                    onMouseEnter={() => handleMouseEnter('cards')}
                    onMouseLeave={handleMouseLeave}
                >
                    TIMELINE
                </div>
                <div
                    style={hoveredButton === 'home' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                    onClick={handleSignOut}
                    onMouseEnter={() => handleMouseEnter('home')}
                    onMouseLeave={handleMouseLeave}
                >
                    SIGN OUT
                </div>
            </div>
        </nav>
    );
};

const buttonStyle = {
    cursor: 'pointer',
    width: '184px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '1.125em',
    fontWeight: '800',
    letterSpacing: '2px',
    color: 'black',
    backgroundColor: '#644dff',
    border: '2px solid #4836bb',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 0 #4836bb',
    transform: 'skew(-10deg)',
    transition: 'all 0.1s ease',
    filter: 'drop-shadow(0 15px 20px rgba(101, 77, 255, 0.39))',
    marginTop: '-10px', 
    marginRight: '10px'
};

const buttonHoverStyle = {
    letterSpacing: '0px',
    transform: 'skew(-10deg) translateY(8px)',
    boxShadow: '0 0 0 rgba(101, 77, 255, 0.39)'
};

const lifelens ={
    color: '#644dff',
    width: '184px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '2em',
    fontWeight: '800',
    letterSpacing: '2px',
    marginLeft:'20px'
}

export default Navbar;
