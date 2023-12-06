import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiToken = process.env.REACT_APP_API_TOKEN;

  console.log('API KEY: ', apiKey);
  console.log('API TOKEN: ', apiToken);
  
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1 className='text-red-500 underline'>API KEY: {apiKey}</h1>
        <h1 className='text-red-500 underline'>API TOKEN: {apiToken}</h1>
      </header>
    </div>
  );
}

export default App;
