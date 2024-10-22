import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './utils/LoadingSpinner';

export default function Error404() {
  const navigate = useNavigate();
  return (
    <div className='main-form dark' style={{ position: 'relative', textAlign: 'center', padding: '10px' }}>
      <LoadingSpinner />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
        <h1 style={{ fontSize: '72px', marginBottom: '10px' }}>404</h1>
        <p style={{ fontSize: '24px' }}>“Oops, something went wrong. 404 error”</p>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          Looks like you're lost in space. Let's get you back to the homepage.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Take Me Home
        </button>
      </div>
    </div>
  );
}