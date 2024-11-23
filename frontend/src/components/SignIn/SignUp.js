import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Diary from './Diary1.png';

export default function SignUp() {

  const backend = 'http://123.0.0.1:5000' || 'http://localhost:5000';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backend}/api/auth/sign-up`, { email, password, name });
      console.log('Sign-up successful:', response.data);
      setIsConfirmed(true); // Show confirmation input after successful sign-up
    } catch (error) {
      console.error('Error during sign-up:', error.response?.data?.error || error.message);
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backend}/api/auth/confirm`, { email, confirmationCode });
      console.log('User confirmed:', response.data);
      navigate('/sign-in'); // Redirect to sign-in page after confirmation
    } catch (error) {
      console.error('Error during confirmation:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '10vh', color: 'white' }}>
      <div style={{ width: '462px', height: '600px', margin: 'auto', padding: '20px', backgroundImage: `url(${Diary}),url('https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/Diary1.png')`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginTop: '40px' }}>{isConfirmed ? 'Confirm your account' : 'Sign up'}</h1>
        <form onSubmit={isConfirmed ? handleConfirm : handleSignUp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '20px' }}>
          {!isConfirmed && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="  Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{height:'40px', borderRadius:'10px'}}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="  your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{height:'40px', borderRadius:'10px'}}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="  ••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{height:'40px', borderRadius:'10px'}}
                />
              </div>
            </>
          )}
          {isConfirmed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="confirmationCode">Confirmation Code</label>
              <input
                type="text"
                id="confirmationCode"
                name="confirmationCode"
                placeholder="Enter confirmation code"
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            style={{ padding: '10px', backgroundColor: '#644dff', color: 'black', border: 'none', cursor: 'pointer' }}
          >
            {isConfirmed ? 'Confirm' : 'Sign up'}
          </button>
          <p style={{ textAlign: 'center' }}>
            Already have an account? <a href='/sign-in' style={{ color: '#644dff' }}>Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
