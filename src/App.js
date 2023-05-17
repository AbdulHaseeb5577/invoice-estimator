import './App.css';
import { Login } from './components/Login';
import { Create } from './components/Create.js';
import  { View }  from './components/View';
import { Edit } from './components/Edit';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import * as React from 'react';
import { BrowserRouter as Router,Routes, Route, Link, } from 'react-router-dom'
function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  
  
  
  return (

    <div className="App">
    <ApolloProvider client={client}>
      <Router>
          <div>
            <Link to="/" style={{marginLeft:20}}>login</Link>
            <Link to='/Create' style={{marginLeft:20}}>Create</Link>
            <Link to="/View" style={{marginLeft:20}}>View</Link>
          </div>
        <Routes>
          <Route exact path='/' element={<Login/>} />
          <Route path='/Create' element={<Create/>} />
          <Route path='/View' element={<View/>} />
          <Route path='/Edit' element={<Edit/>} />
          <Route path='*' element={<h1>you are not on a page</h1>} />
        </Routes>
      </Router>
      </ApolloProvider>
    </div>

  );
}

export default App;




    // {
    //   // "src": "logo192.png",
    //   "type": "image/png",
    //   "sizes": "192x192"
    // },
    // {
    //   "src": "logo512.png",
    //   "type": "image/png",
    //   "sizes": "512x512"
    // }