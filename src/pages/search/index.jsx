import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../../context/globalState';
import { Link, useNavigate } from 'react-router-dom';
import LoginDialog from '../../components/loginDialog';

const SearchMovies = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [movieDetails, setMovieDetails] = useState(null); // State for detailed movie information
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility
    const { state, dispatch } = useUserContext();
    const { currentUser } = state;
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 3;

    // const [page, setPage] = useState(2);
    // const [perPage, setPerPage] = useState(3);

    // useEffect(() => {
    //     console.log("asdasd");
    //     const startIndex = (page - 1) * perPage;
    //     const endIndex = startIndex + perPage;
    //     setMovies(movies.slice(startIndex, endIndex));
    // }, [page, perPage,]);

    useEffect(() => {
        if (!currentUser) {
            setOpenDialog(true);
        }
    }, [currentUser]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate('/'); // Redirect to login
    };

    const handleLogout = () => {
        // Clear the current user from global state
        dispatch({ type: 'LOGOUT_USER' });
        // Navigate to login page (or home)
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        const apiKey = process.env.REACT_APP_OMDB_API_KEY;

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
            const data = await response.json();
            if (data.Response === "True") {
                setMovies(data.Search || []);
            } else {
                setMovies([]);
                alert('No movies found');
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const addToWatchlist = (movie) => {
        if (!state.currentUser) {
            alert('Please log in before adding movies to your watchlist.');
            return;
        }
        dispatch({ type: 'ADD_MOVIE_TO_USER', payload: movie });
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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

    const userEmail = state.currentUser?.email || 'User';
    const userInitial = userEmail.charAt(0).toUpperCase();

    const handleNext = () => {
        if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * moviesPerPage;
    const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

    // useEffect()

    return (
        <div className='w-full h-full flex flex-col relative'>
            {/* Side Menu */}
            {openDialog && <LoginDialog open={openDialog} onClose={handleCloseDialog} />}

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

            {/* Header and Search Section */}
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
                <div className='flex flex-col gap-2'>
                    <p>Browse movies, add them to Watchlist and share them with friends.</p>
                    <p>
                        Just click the <img
                            width={24}
                            height={24}
                            alt="avtr"
                            src={'/bookmark.png'}
                            style={{ display: 'inline', verticalAlign: 'middle' }}
                        /> on top left corner of movie card to add a movie. Click on View Details for information about the movie.
                    </p>
                </div>
            </div>

            {/* Search Form */}
            <h1 className='text-3xl font-bold md:pt-4 pt-2'>Search Movies</h1>
            <form onSubmit={handleSearch} className='flex gap-2 mb-4 w-full'>
                <div className='flex gap-0 items-center w-full rounded border border-black'>
                    <div className="px-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm5.293-2.707l5.414 5.414"
                            />
                        </svg>
                    </div>
                    <input
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search by title'
                        className='p-2 w-full outline-none'
                    />
                    <button type='submit' className='bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500'>
                        Search
                    </button>
                </div>
            </form>

            {/* Movie List */}
            <div className='w-full overflow-x-auto whitespace-nowrap py-4 shadow-lg'>
                {movies.length > 0 ? (
                    <div className='flex flex-col gap-4'>
                        <div className='flex space-x-4'>
                            {currentMovies.map((movie) => {
                                const isInWatchlist = state.currentUser?.movies.some((m) => m.imdbID === movie.imdbID);

                                return (
                                    <div
                                        key={movie.imdbID}
                                        className='border flex flex-col w-48 min-w-[200px] shadow-md relative group hover:border-green-500'
                                        style={{ minWidth: '200px' }}
                                    >
                                        {/* Movie Poster */}
                                        <div className="relative">
                                            <img
                                                src={movie.Poster}
                                                alt={movie.Title}
                                                className='w-full h-64 object-cover'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-start items-start p-2'>
                                                <img
                                                    width={24}
                                                    height={24}
                                                    alt={isInWatchlist ? "ticked" : "bookmark"}
                                                    src={isInWatchlist ? '/checked.png' : '/bookmark.png'}
                                                    className="cursor-pointer"
                                                    onClick={() => addToWatchlist(movie)}
                                                />
                                            </div>
                                        </div>

                                        {/* Movie Details */}
                                        <h2 className='text-lg font-bold mt-2 text-wrap'>{movie.Title}</h2>
                                        <p>{movie.Year}</p>
                                        <div className='flex-grow'></div>

                                        {/* Add to Watchlist Button */}
                                        <button
                                            className='bg-green-500 text-white py-1 px-2 rounded mt-2 w-full'
                                            style={{ minWidth: '120px' }}
                                            onClick={() => addToWatchlist(movie)}
                                        >
                                            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                                        </button>

                                        {/* View Details Button */}
                                        <button
                                            className='bg-green-500 text-white py-1 px-2 rounded mt-2 w-full'
                                            style={{ minWidth: '120px' }}
                                            onClick={() => fetchMovieDetails(movie.imdbID)} // Fetch movie details on click
                                        >
                                            View Details
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='flex gap-2'>
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className='bg-green-300 p-2 disabled:bg-gray-300'
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentPage >= Math.ceil(movies.length / moviesPerPage)}
                                className='bg-green-300 p-2 disabled:bg-gray-300'
                            >
                                Next
                            </button>
                        </div>
                    </div>

                ) : (
                    <p>No movies found.</p>
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

export default SearchMovies;
