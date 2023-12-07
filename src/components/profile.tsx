import { useState } from 'react';
import { auth } from '../firebase';
import { updateEmail } from 'firebase/auth';

const Profile = () => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const email = auth.currentUser?.email;
  const emailVerified = auth.currentUser?.emailVerified;
  console.log(email);
  
  console.log(auth.currentUser?.emailVerified);
  

  const handleEmailChange = () => {
    setIsEditingEmail(true);
  };

  const handleEmailUpdate = () => {
    // Mettez à jour l'email dans Firebase avec la nouvelle valeur (newEmail)
    // Assurez-vous de gérer les erreurs potentielles lors de la mise à jour de l'email.

    const user = auth.currentUser;

    if (user?.emailVerified) {
      updateEmail(auth.currentUser!, newEmail)
        .then(() => {
          // Mise à jour réussie, vous pouvez réinitialiser l'état local ici si nécessaire
          setIsEditingEmail(false);
        })
        .catch((error: any) => {
          // Gérez l'erreur, par exemple, affichez un message à l'utilisateur
          console.error('Erreur lors de la mise à jour de l\'email :', error.message);
        });
    }
  };

  return (
    <div className='profile mt-8'>
      <div className='flex flex-col ml-8'>
        <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`} alt=""
          className="w-32 h-32 rounded-full" />
        <span className='text-xl text-black underline'>{email}</span>
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
          <button
            type="button"
            onClick={handleEmailChange}
            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Changement de mail
          </button>
        )}

        <button
          type="button"
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Changement de mot de passe
        </button>
      </div>
    </div>
  );
};

export default Profile;