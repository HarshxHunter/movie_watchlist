import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import SearchMovies from './pages/search';
import MovieList from './pages/list';
import { UserProvider } from './context/globalState';
import MovieLayout from './components/movieLayout';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Movie Layout Route */}
          <Route path="/" element={<MovieLayout />}>
            <Route path="search" element={<SearchMovies />} />
            <Route path="list" element={<MovieList />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
