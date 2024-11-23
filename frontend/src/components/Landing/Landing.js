import React,{useState} from 'react';
//import logo from '../logo.png';
import homeImg from './assets/homeimg.png';

export default function Landing() {
    const [hoveredButton, setHoveredButton] = useState(null);

    const handleMouseEnter = (button) => {
        setHoveredButton(button);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };
  return (
    <div className='landing'>
      <header>
        <h2>LifeLens</h2>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    style={hoveredButton === 'services' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                    onClick={() => window.location.href = "/services"}
                    onMouseEnter={() => handleMouseEnter('services')}
                    onMouseLeave={handleMouseLeave}
                >
                    SERVICES
                </div>
                <div
                    style={hoveredButton === 'signin' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                    onClick={() => window.location.href = "/sign-in"}
                    onMouseEnter={() => handleMouseEnter('signin')}
                    onMouseLeave={handleMouseLeave}
                >
                    SIGN IN
                </div>
            </div>
        </nav>
      </header>
      <section id="home" style={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px'}}>
        <div style={{display: 'flex',
            width: '100%',
            color: 'rgb(255, 255, 255)',
            borderRadius: '20px',
            marginTop: '60px'}}>
            <div style={{
                width: '60%',
                paddingLeft: '50px',
                paddingTop: '100px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '70'
            }}>
                <h1 style={{color:'#31a8da'}}>Welcome to LifeLens</h1>
                <h3>&emsp;Your Personal Journey, Captured and Understood.</h3>
                <p style={{ fontSize: '20px', marginTop:'20px' }}> &emsp; LifeLens is a personal diary web application aimed at helping users express and manage their emotions by creating, storing, and reflecting on diary entries. The app's focus on emotional well-being makes it a powerful tool for mental health and self-reflection, offering users a secure space to document and explore their feelings.</p>
                <ul>
                    <li style={{ fontSize: '20px' }}>Seamless Diary Entry Creation</li>
                    <li style={{ fontSize: '20px' }}>Multi-Language Support</li>
                    <li style={{ fontSize: '20px' }}>Secure and Private</li>
                    <li style={{ fontSize: '20px' }}>Real-Time Voice-to-Text Transcription</li>
                    <li style={{ fontSize: '20px' }}>Sentiment Detection</li>
                </ul>
            </div>
            <div style={{width:'40%'}}>
                <img style={{width: '100%', height: 'auto'}} src={homeImg} alt="Home" />
            </div>
        </div>
      </section>
    </div>
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
    marginTop: '-10px', // Adjust to move up
    marginRight: '10px'
};

const buttonHoverStyle = {
    letterSpacing: '0px',
    transform: 'skew(-10deg) translateY(8px)',
    boxShadow: '0 0 0 rgba(101, 77, 255, 0.39)', // Update shadow color
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
