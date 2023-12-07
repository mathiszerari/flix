import { useState } from 'react';
import { auth } from '../firebase';
import { updateEmail } from 'firebase/auth';

const Favorite = () => {


  return (
    <div className='Favorite mt-8'>
      <span className='text-xl text-black'>Favorites</span>
    </div>
  );
};

export default Favorite;