import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Link } from 'react-router-dom';
import {
  getFirestore, collection, addDoc
} from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [connected, setConnected] = useState(false);

  const handlePasswordChange = (e: { target: { value: any; }; }) => {
    const newPassword = e.target.value;

    // Password strength requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);

    if (newPassword.length < minLength) {
      setPasswordError(`Password must be at least ${minLength} characters long.`);
    } else if (!(hasUpperCase && hasLowerCase && hasDigit)) {
      setPasswordError('Password must include uppercase, lowercase, and digit.');
    } else {
      setPasswordError('');
    }
    setPassword(newPassword);
  };

  const signupAction = async (e: { preventDefault: () => void; }) => {
    try {
      e.preventDefault();
  
      if (passwordError) {
        console.log('Invalid password');
        setPasswordError('Password must include uppercase, lowercase, and digit.');
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Send email verification
      await sendEmailVerification(userCredential.user);
  
      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        email: email,
        password: password,
        favorites: []
      });
  
      setConnected(true);
    } catch (error) {
      setEmailError('Email already used');
    }
  };   

  return (
    <div className='auth'>
      <form onSubmit={signupAction}>
        <h1>Signup</h1>
        <input
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='Enter your password'
          value={password}
          onChange={handlePasswordChange}
        />
        {emailError && <p className="error">{emailError}</p>}
        {passwordError && <p className="error">{passwordError}</p>}
        <button type="submit">Submit</button>
      </form>

      <button >
        <Link to="/login">Already have an account?</Link>
      </button>
    </div>
  );
};

export default Signup;