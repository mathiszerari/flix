import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/flix-logo.svg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const loginAction = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log(userCredential);
    } catch (error) {
      // Gérer les erreurs ici
      console.error('Erreur lors de la connexion :', error);
      setAuthError('Email ou mot de passe incorrect');
    }
  };

  const redirect = () => {
    if (auth.currentUser) {
      navigate('/');
    }
  }

  return (
    <div className='auth'>
      <div className="flex mt-2 justify-center flex-col items-center">
        <div className="px-8 my-4">
          <div className="flex justify-center">
              <img className="w-16 mb-6" src={logo} alt="flix app logo" />
          </div>
          <span className="text-2xl font-medium text-gray-200 mb-6 flex justify-center">Log into your account</span>

          <div className="mx-auto pb-6">

            <form className="mt-6" onSubmit={loginAction}>
              <div className="mb-4">
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm text-white bg-gray-900 placeholder-gray-500 border border-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Enter your email" required />
              </div>
              <div className="mb-4">
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="shadow-sm text-white bg-gray-900 placeholder-gray-500 border border-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Password (optional)" required />
                </div>
              {authError && <p className="error pb-2 text-red-500">{authError}</p>}
              <button type="submit" onClick={redirect} className="cursor-pointer w-full text-gray-950 bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm py-2.5 text-center">Continue</button>
            </form>

            <Link to="/signup">
              <button className="cursor-pointer group px-6 flex justify-center transition delay-150 duration-300 mt-10 w-full text-gray-400 bg-gray-950 border border-gray-800 focus:ring-4 focus:outline-none font-medium hover:text-gray-300 rounded-lg text-sm py-2.5 text-center">
                <span className="transform ml-1">Don't have an account? Sign up</span> 
                <div className="transform group-hover:translate-x-1 ml-1 duration-300">→</div>
              </button>           
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;