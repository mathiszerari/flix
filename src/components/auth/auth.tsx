import React, { useEffect } from 'react';
import { auth } from '../../firebase';

const Auth = () => {
  const [authUser, setAuthUser] = React.useState<any | null>(null);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }

    })
  }, [])

  const userSignout = () => {
    auth.signOut().then(() => {
      console.log('Signed out');
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <div>
      {authUser ? <><p>{`Logged in as ${authUser.email}`}</p>
        <button onClick={() => auth.signOut()}>Sign out</button>
      </> : <p>Logged out</p>}
    </div>
  );
}

export default Auth