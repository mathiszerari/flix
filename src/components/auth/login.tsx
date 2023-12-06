import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loginAction = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      }).catch((error) => {
        console.log(error);
      })
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
      <Link to="/signup">Don't have an account ?</Link>
    </div>
  );
};

export default Login;