import './App.css';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { Create } from './components/Create.js';
import { View } from './components/View';
import { Edit } from './components/Edit';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
          <Navigation />
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/View" element={<View />} />
            <Route path="/Edit" element={<Edit />} />
            <Route path="*" element={<h1>You are not on a page</h1>} />
          </Routes>
        </Router>
      </ApolloProvider>
    </div>
  );
}

function Navigation() {
  const location = useLocation();

  // Determine whether to show the navigation links
  const shouldShowNavigation = location.pathname !== '/';

  return (
    <div className='Navigation'>
      {shouldShowNavigation && (
        <div className='Links'>
          <Link to="/View">
            View
          </Link>
          <Link to="/Create">
            Create
          </Link>
          <Logout />
        </div>
      )}
    </div>
  );
}

export default App;
