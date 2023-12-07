import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Shows from './pages/Shows';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Homepage from './pages/Homepage';
import SearchPage from './pages/SearchPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:"",
        element: <Homepage/>
      },
      {
        path: "calendar",
        element: <Calendar/>
      },

      {
        path: "shows/:showId",
        element: <Shows/>
      },
      {
        path: "profile",
        element: <Profile/>
      },
      {
        path: "search",
        element: <SearchPage/>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: < SignupPage />
  }
  
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
