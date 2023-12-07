import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = useState('');

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
  

  return (
    <div className='auth'>
      <form onSubmit={loginAction}>
        <h1>Login</h1>
        <input type="email" placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Submit</button>
      </form>
      {authError && <p className="error">{authError}</p>}
      <Link to="/signup">Don't have an account ?</Link>
    </div>
  );
};

export default Login;