import { createContext } from 'react';
import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GenresProvider } from './context/GenresContext';


function App() {
  return (
    <div className="App">
      <GenresProvider>
        <Header />
        <Outlet />
      </GenresProvider>

    </div>
  );
}

export default App;