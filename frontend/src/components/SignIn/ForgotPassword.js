import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Handle password reset logic here
    console.log('Password reset link sent to:', email);
    handleClose();
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h2>Reset password</h2>
        <p>Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.actions}>
            <button type="button" onClick={handleClose} style={styles.button}>Cancel</button>
            <button type="submit" style={{ ...styles.button, backgroundColor: '#007bff', color: '#fff' }}>Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '10px',
    cursor: 'pointer',
  },
};

export default ForgotPassword;
