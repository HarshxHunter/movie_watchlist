import React, { useState, useRef } from 'react';
import { useUserContext } from '../../context/globalState';
import { Link, useNavigate } from 'react-router-dom';


const MovieList = () => {
    const { state, dispatch } = useUserContext();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Function to remove a movie from the watchlist
    const removeFromWatchlist = (movie) => {
        dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movie });
    };

    // Fetch detailed movie information based on imdbID
    const fetchMovieDetails = async (imdbID) => {
        const apiKey = process.env.REACT_APP_OMDB_API_KEY;
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
            const data = await response.json();
            if (data.Response === "True") {
                setMovieDetails(data); // Set the detailed movie information
            } else {
                alert('No movie details found.');
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT_USER' });
        navigate('/');
        // Optionally navigate to login page if needed
    };

    const userEmail = state.currentUser?.email || 'User';
    const userInitial = userEmail.charAt(0).toUpperCase();

    return (
        <div className='w-full h-full flex flex-col relative'>
            {/* Side Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
                    <div className="bg-white w-3/4 h-full p-4 shadow-lg transform transition-transform duration-300 translate-x-0">
                        <button onClick={toggleMenu} className="absolute top-2 right-2 text-lg">X</button>
                        <h2 className="text-xl font-bold mb-4">Menu</h2>
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
                            </ul>
                        </nav>
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
                </div>
            )}

            {/* Header Section */}
            <div className='w-full flex flex-col md:gap-6 gap-4 border-2 border-red-500 rounded-xl px-2 py-2 md:py-4'>
                <div className='flex md:hidden justify-between'>
                    <h1 className='text-4xl font-semibold'>
                        Welcome to <span className='text-red-600'>MovieDekho</span>
                    </h1>
                    <div className='rounded-full p-2 hover:cursor-pointer' onClick={toggleMenu}>
                        <img
                            width={32}
                            height={32}
                            alt="nav"
                            src={'/mobileNav.png'}
                            style={{ display: 'inline', verticalAlign: 'middle' }}
                        />
                    </div>
                </div>
                <h1 className='hidden md:block text-4xl font-semibold'>
                    Welcome to <span className='text-red-600'>MovieDekho</span>
                </h1>
                <h1 className='text-3xl font-bold mb-4'>Your Watchlist</h1>
                {state.currentUser && state.currentUser.movies.length > 0 ? (
                    <div className='overflow-x-auto py-4'>
                        <div className='flex space-x-4'>
                            {state.currentUser.movies.map((movie) => (
                                <div
                                    key={movie.imdbID}
                                    className='border p-1 flex flex-col relative group hover:border-red-500'
                                    style={{ width: '200px', height: '400px' }} 
                                >
                                    {/* Movie Poster with overlay */}
                                    <div className="relative" style={{ height: '260px' }}>
                                        <img
                                            src={movie.Poster}
                                            alt={movie.Title}
                                            className='w-full h-full object-cover'
                                        />
                                        {/* Overlay for the remove icon */}
                                        <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-start items-start p-2'>
                                            <img
                                                width={24}
                                                height={24}
                                                alt="remove"
                                                src={'/delete.png'}
                                                className="cursor-pointer"
                                                onClick={() => removeFromWatchlist(movie)}
                                            />
                                        </div>
                                    </div>

                                    {/* Movie Details */}
                                    <h2 className='text-xl font-bold mt-2 text-center truncate'>{movie.Title}</h2>
                                    <p className='text-center'>{movie.Year}</p>

                                    {/* View Details Button */}
                                    <button
                                        className='bg-green-500 text-white py-1 px-2 rounded mt-2 w-full'
                                        style={{ minWidth: '120px' }}
                                        onClick={() => fetchMovieDetails(movie.imdbID)} // Fetch movie details on click
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>No movies in your watchlist yet.</p>
                )}
            </div>

            {/* Movie Details Modal or Section */}
            {movieDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <img
                            src={movieDetails.Poster}
                            alt={"moviePoster"}
                            className='w-full h-64 object-fill'
                        />
                        <h2 className="text-2xl font-bold text-center">{movieDetails.Title}</h2>
                        <p><strong>Year:</strong> {movieDetails.Year}</p>
                        <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                        <p><strong>Director:</strong> {movieDetails.Director}</p>
                        <p><strong>IMDb Rating:</strong> {movieDetails.imdbRating}</p>
                        <p><strong>Plot:</strong> {movieDetails.Plot}</p>
                        <button
                            className="mt-4 bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500"
                            onClick={() => setMovieDetails(null)} // Close modal
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;
