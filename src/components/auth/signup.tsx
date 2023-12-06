import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Signup = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signupAction = (e: React.FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      }).catch((error) => {
        console.log(error);
      })
  };

  return (
    <div className='auth'>
      <form onSubmit={signupAction}>
        <h1>Signup</h1>
        <input type="email" placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Signup;