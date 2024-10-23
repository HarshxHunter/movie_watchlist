import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/globalState';

const MovieLayout = () => {
    const { state, dispatch } = useUserContext(); // Access global state
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for the dropdown

    const handleLogout = () => {
        // Clear the current user from global state
        dispatch({ type: 'LOGOUT_USER' });
        // Navigate to login page (or home)
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get the first letter of the user's email
    const userEmail = state.currentUser?.email || 'User';
    const userInitial = userEmail.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen flex">
            {/* Side Menu */}
            <div className="hidden w-1/6 bg-white border-r-2 border-gray-200 text-white p-4 md:flex flex-col justify-between">
                <div>
                    <h2 className="text-4xl text-red-500 font-bold mb-6">MovieDekho</h2>
                    <nav>
                        <ul className="space-y-4">
                            <li>

                                <Link to="/search" className="hover:text-blue-400">
                                    <div className='p-2 bg-red-400 rounded-lg flex gap-2'>
                                        <img
                                            width={24}
                                            height={24}
                                            alt={"home"}
                                            src={'/icons8-home.svg'}
                                            className="cursor-pointer"
                                        />
                                        Search Movies
                                    </div>
                                </Link>

                            </li>
                            <hr />
                            {/* <div className='p-2 bg-red-400 rounded-lg'> */}
                            <li>
                                <Link to="/list" className="hover:text-blue-400">
                                    <div className='p-2 bg-red-400 rounded-lg flex gap-2'>
                                        <img
                                            width={24}
                                            height={24}
                                            alt={"list"}
                                            src={'/list.png'}
                                            className="cursor-pointer"
                                        />
                                        Your Watchlist
                                    </div>
                                </Link>
                            </li>
                            {/* </div> */}

                        </ul>
                    </nav>
                </div>

                {/* User Info Section */}
                <div className="flex items-center justify-between mt-6 relative bg-blue-400 rounded-lg p-2" ref={dropdownRef}>
                    <div className="flex items-center">
                        {/* User Initial in a Circle */}
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mr-2">
                            {userInitial}
                        </div>
                        {/* User Email */}
                        <span className="text-white">{userEmail}</span>
                    </div>

                    {/* Hamburger Icon */}
                    <button onClick={toggleDropdown} className="focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 bottom-12 mt-2 w-48 bg-gray-200 text-black rounded shadow-lg z-50">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-400 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-5/6 p-4 flex-grow">
                <Outlet /> {/* This will render the child routes */}
            </div>
        </div>
    );
};

export default MovieLayout;
