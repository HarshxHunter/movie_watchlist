import React from 'react';

const LoginDialog = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }} className='flex flex-col gap-2 items-center justify-center'>
                <h2 className='text-xl font-semibold'>Session Expired</h2>
                <p>You need to log in to access this page.</p>
                <button onClick={onClose} className='bg-blue-400 p-2 rounded-md hover:bg-blue-600'>Go to Login</button>
            </div>
        </div>
    );
};

export default LoginDialog;
