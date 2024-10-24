import React, { createContext, useReducer, useContext } from 'react';

// Create a context
const UserContext = createContext();

// Initial state
const initialState = {
    currentUser: null,
    users: [],
};

// Reducer function to handle actions
const userReducer = (state, action) => {
    switch (action.type) {
        // Handle user login and association
        case 'ADD_USER':
            const existingUser = state.users.find(user => user.email === action.payload.email);
            if (existingUser) {
                return {
                    ...state,
                    currentUser: existingUser, // Set the current user if they already exist
                };
            } else {
                const newUser = { email: action.payload.email, movies: [] }; // Initialize with an empty movie array
                return {
                    ...state,
                    users: [...state.users, newUser], // Add new user to the list
                    currentUser: newUser, // Set the new user as the current user
                };
            }

        // Add movie to the current user's watchlist
        case 'ADD_MOVIE_TO_USER':
            // Check if the movie already exists in the user's movie list
            const isMovieAlreadyInWatchlist = state.currentUser.movies.some(
                (movie) => movie.imdbID === action.payload.imdbID
            );

            // If movie already exists, return the same state without adding the duplicate
            if (isMovieAlreadyInWatchlist) {
                return state;
            }

            // Otherwise, add the movie to the watchlist
            return {
                ...state,
                users: state.users.map(user =>
                    user.email === state.currentUser.email
                        ? { ...user, movies: [...user.movies, action.payload] }
                        : user
                ),
                currentUser: {
                    ...state.currentUser,
                    movies: [...state.currentUser.movies, action.payload],
                },
            };


        // Remove movie from the current user's watchlist
        case 'REMOVE_FROM_WATCHLIST':
            return {
                ...state,
                users: state.users.map(user =>
                    user.email === state.currentUser.email
                        ? {
                            ...user,
                            movies: user.movies.filter((movie) => movie.imdbID !== action.payload.imdbID)
                        }
                        : user
                ),
                currentUser: {
                    ...state.currentUser,
                    movies: state.currentUser.movies.filter(
                        (movie) => movie.imdbID !== action.payload.imdbID
                    ),
                },
            };

        // Log out the current user
        case 'LOGOUT_USER':
            return {
                ...state,
                currentUser: null, // Clear the current user on logout
            };

        default:
            return state;
    }
};

// Context provider to wrap the app
export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
    return useContext(UserContext);
};
