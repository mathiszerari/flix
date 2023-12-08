import { useState, useEffect } from 'react';
import { auth } from '../firebase';

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

const Profile = () => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const email = auth.currentUser?.email;
  const emailVerified = auth.currentUser?.emailVerified;
  const [receiveUpdates, setReceiveUpdates] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Perform any asynchronous operations here
      // For example, you might want to fetch additional user data

      // Simulating an asynchronous operation with setTimeout
      setTimeout(() => {
        // Set loading to false when the data is ready
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleEmailChange = () => {
    setIsEditingEmail(true);
  };

  const handleEmailUpdate = () => {
    setIsLoading(true);

    const user = auth.currentUser;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='profile mt-8'>
      {isLoading ? <Loader /> : (
        <>
          <div className='flex flex-col ml-8'>
            <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`} alt=""
              className="w-32 h-32 rounded-full" />
            <span className='text-xl text-gray-200 underline'>{email}</span>
          </div>
          <div className='mt-16'>
            {isEditingEmail ? (
              <div>
                <input
                  type="email"
                  placeholder="Nouvel email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={handleEmailUpdate}>Enregistrer</button>
              </div>
            ) : (
              <button type="button" onClick={handleEmailChange}
                className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Changement de mail
              </button>
            )}

            <button type="button"
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Changement de mot de passe
            </button>
          </div>
          <div className='flex flex-col mx-auto w-2/3 p-4 mt-16 bg-gray-300 rounded-3xl'>
            <span className='text-black text-2xl p-2'>Notification</span>

            <div className='flex justify-around py-4 bg-gray-200 rounded-3xl'>
              <span className='text-black'>New show release</span>
              {receiveUpdates ? (
                <button type="button" className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"></button>
              ) : (
                <button type="button" className="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"></button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;