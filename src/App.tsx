import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthPage from './pages/Signup';

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiToken = process.env.REACT_APP_API_TOKEN;

  console.log('API KEY: ', apiKey);
  console.log('API TOKEN: ', apiToken);
  
  
  return (
    <div className="App">
      <AuthPage />
    </div>
  );
}

export default App;
