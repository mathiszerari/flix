import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  getFirestore, collection, addDoc
} from "firebase/firestore";
import logo from '../../assets/images/flix-logo.svg';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

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

  const redirect = () => {
    if (auth.currentUser) {
      navigate('/');
    }
  }

  return (
    <div className='auth'>
      <div className='flex items-center justify-center h-screen'>
        <div className=" justify-center flex-col items-center">
          <div className="px-8">
            <div className="flex justify-center">
              <img src={logo} alt="Ship fast logo" className="w-16 mb-6"/>
            </div>
            <span className="text-2xl font-medium text-gray-200 mb-6 flex justify-center">Create your account</span>
        
            <div className="mx-auto pb-6">
        
              <form className="mt-6" onSubmit={signupAction}>
                <div className="mb-4">
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm text-white bg-gray-900 placeholder-gray-500 border border-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Email address" required />
                    {emailError && <p className="error">{emailError}</p>}
                </div>
                <div className="mb-4">
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="shadow-sm text-white bg-gray-900 placeholder-gray-500 border border-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Password (optional)" required />
                  {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <button type="submit" onClick={redirect} className="cursor-pointer w-full text-gray-950 bg-gray-200 focus:ring-4 focus:out border-10 w-478line-none font-medium rounded-lg text-sm py-2.5 text-center">Create account</button>
              </form>

              <Link to="/login">
                <button className="cursor-pointer px-8 group flex justify-center transition delay-150 duration-300 mt-10 w-full text-gray-400 bg-gray-950 border border-gray-800 focus:ring-4 focus:out border-10 w-478line-none font-medium hover:text-gray-300 rounded-lg text-sm py-2.5 text-center">
                  <span className="transform ml-1">I already have an account</span> 
                  <div className="transform group-hover:translate-x-1 ml-1 duration-300">→</div>
                </button>           
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;