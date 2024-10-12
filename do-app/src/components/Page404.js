import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className='main-form dark' style={{ textAlign: 'center', padding: '10px' }}>
            <h1 style={{ fontSize: '72px', marginBottom: '10px' }}>404</h1>
            <p  style={{ fontSize: '24px' }}>“Oops, something went wrong. 404 error”</p>
            
            <img 
                src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif" 
                alt="Confused Travolta" 
                style={{ margin: '10px', width: '300px' }} 
            />
            
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
    );
}