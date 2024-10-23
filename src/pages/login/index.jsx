import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/globalState';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useUserContext();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // Save email to localStorage to simulate login
            dispatch({ type: 'ADD_USER', payload: { email } });
            localStorage.setItem('userEmail', email);
            navigate('/search'); // Redirect to the search page
        } else {
            setError('Please enter an email to log in.');
        }
    };

    return (
        <div className='w-full h-[100vh] flex flex-col gap-10'>
            <div className='w-full py-2 flex flex-col items-center justify-center text-4xl text-red-500 font-bold bg-gray-200'>
                MovieDekho
            </div>

            <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                <div className='flex flex-col items-center justify-center rounded-lg bg-green-100 w-full md:w-1/2 py-2'>
                    <p className='text-center md:text-left pb-4 font-semibold'>
                        Welcome to MovieDekho, the final destination for free Movie details!
                    </p>
                    <div className='mb-4'>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            value={email}
                            onChange={handleEmailChange}
                            className='border p-2 w-64'
                        />
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                    <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
