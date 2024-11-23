import React, { useState } from 'react';
import bg from './assets/bg.png'; // Default background for the card
// Import other images for each card
import cognito from './assets/cognito.png';
import dynamodb from './assets/dynamodb.png';
import s3 from './assets/s3.png';
import amplify from './assets/amplify.png';
import comprehend from './assets/comprehend.png';
import transcribe from './assets/transcribe.png';
import translate from './assets/translate.png';
import iam from './assets/iam.png';

function Services() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredCard(index); // Delay state change slightly
  };

  const handleMouseLeave = () => {
    setHoveredCard(null); // Delay state reset slightly
  };

  const cardData = [
    { img: cognito, text: 'Cognito' ,desc:'We have used AWS Cognito to manage user authentication and ensure secure login to your application. It allows us to authenticate users seamlessly and control access, so only authorized individuals can view their personal diary entries.'},
    { img: dynamodb, text: 'DynamoDB',desc:'We use Amazon DynamoDB to store your diary entries in a fast and reliable database. This service ensures efficient storage and retrieval of your content, including your text entries, sentiment analysis, images, and metadata, so everything is accessible when you need it.' },
    { img: s3, text: 'S3',desc:'For storing images linked to your diary entries, we have used Amazon S3. This service allows us to securely upload and retrieve your images, ensuring they are always available and seamlessly integrated with your text content.' },
    { img: amplify, text: 'Amplify',desc:'We have used AWS Amplify to deploy and host the frontend of your application. This service ensures smooth integration with backend resources, providing a seamless user experience and ensuring the app is scalable and accessible from anywhere.' },
    { img: comprehend, text: 'Comprehend',desc:'We have integrated AWS Comprehend to analyze the sentiment of your diary entries. This helps us understand the emotional tone of your content, providing you with appropriate replies according to your mood and feelings as you reflect on your experiences.' },
    { img: transcribe, text: 'Transcribe', desc:'We have integrated AWS Transcribe to provide real-time voice-to-text conversion. This allows you to record audio and have it instantly transcribed into text for your diary, making it easy to add entries by speaking instead of typing.' },
    { img: translate, text: 'Translate', desc:'We used AWS Translate to translate your diary entries into different languages, so you can easily interact with your content in multiple languages, making the app accessible to a wider audience.'},
    { img: iam, text: 'Lambda',desc:'Handles backend logic for specific functions like triggering apis or processing data without needing a dedicated server.' }
  ];

  return (
    <div>
      <header>
        <h2>LifeLens</h2>
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'black',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}
        >
          <div style={lifelens}>LifeLens</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={
                hoveredCard === 'home'
                  ? { ...buttonStyle, ...buttonHoverStyle }
                  : buttonStyle
              }
              onClick={() => (window.location.href = '/')}
              onMouseEnter={() => handleMouseEnter('home')}
              onMouseLeave={handleMouseLeave}
            >
              HOME
            </div>
            <div
              style={
                hoveredCard === 'signin'
                  ? { ...buttonStyle, ...buttonHoverStyle }
                  : buttonStyle
              }
              onClick={() => (window.location.href = '/sign-in')}
              onMouseEnter={() => handleMouseEnter('signin')}
              onMouseLeave={handleMouseLeave}
            >
              SIGN IN
            </div>
          </div>
        </nav>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          justifyItems: 'center',
          padding: '100px 20px 20px'
        }}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'transparent',
              width: '320px',
              height: '280px',
              perspective: '1000px',
              fontFamily: 'sans-serif'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 1s',
                transformStyle: 'preserve-3d',
                transform: index === hoveredCard ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                style={{
                  boxShadow: '0 8px 14px 0 rgba(0,0,0,0.2)',
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  border: '1px solid #4836bb',
                  borderRadius: '1rem',
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  overflow: 'hidden',
                  color: 'coral'
                }}
              >
                <img
                  src={card.img}
                  alt="Card"
                  style={{
                    width: '55%',
                    height: '55%',
                    objectFit: 'contain',
                    margin: 'auto',
                    display: 'block',
                    marginTop:'50px'
                  }}
                />
                <p
                  style={{
                    fontSize: '1.5em',
                    fontWeight: '900',
                    textAlign: 'center',
                    margin: 0,
                    height: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {card.text}
                </p>
              </div>

              <div
                style={{
                  boxShadow: '0 8px 14px 0 rgba(0,0,0,0.2)',
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  border: '1px solid #4836bb',
                  borderRadius: '1rem',
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  color: 'white',
                  transform: 'rotateY(180deg)'
                }}
              >
                <p
                  style={{
                    fontSize: '1em',
                    fontWeight: '400',
                    textAlign: 'left',
                    margin: '10px 10px',
                    marginLeft:'20px',
                    marginRight:'20px',
                    fontFamily: 'Dancing Script, cursive',
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;

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

const lifelens = {
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
  marginLeft: '20px'
};
