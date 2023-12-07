import { auth } from '../firebase';

const Profile = () => {
  const email = auth.currentUser?.email

  return (
    <div className='profile mt-8'>
      <div className='w-32 h-32 rounded'>
        <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`} alt="" />
      </div>
      <div className='flex flex-col gap-5'>
        <span className='text-3xl text-black underline'>{email}</span>
      </div>
      <div className='mt-6'>
        <button type="button" className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Changement de mail</button>
        <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Changement de mot de passe</button>
      </div>
    </div>
  );
};

export default Profile;