import { NavLink } from "react-router-dom";
import { auth } from "../firebase";
import SearchBar from "./search/SearchBar";
import { useEffect, useState } from "react";
import flixlogo from "../assets/images/flix-logo.svg"

export default function Header() {
  const [user, setUser]: any = useState(null);
  const [email, setEmail]: any = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            // L'utilisateur est connecté
            setUser(user);
            console.log(user);
            setEmail(user.email);
          } else {
            // L'utilisateur n'est pas connecté
            setUser(null);
          }
        });
    
        // Nettoyage de l'effet lorsque le composant est démonté
        return () => unsubscribe();
    }, []);

  return (
    <header className="flex items-center justify-between">
      <NavLink to="/">
        <img className="w-16" src={flixlogo} alt="flix app logo" />
      </NavLink>
      <nav className="flex items-center justify-around mt-4 gap-4">
        <SearchBar/>
        <NavLink to="calendar">Calendar</NavLink>
        {/* Condition pour afficher ou cacher les liens */}
        {email ? null : (
          <>
            <NavLink to="login">Login</NavLink>
            <NavLink to="signup">Signup</NavLink>
          </>
        )}
        {/* Condition pour afficher ou cacher les liens */}
        {email ? (
          // Contenu à afficher si l'utilisateur est connecté
          <>
            <NavLink to="favorites">Favorites</NavLink>
            <div className='w-12 h-12'>
              <NavLink to="profile">
                <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`} alt=""
                className="rounded-full" />
              </NavLink>
            </div>
          </>
        ) : null}
      </nav>
    </header>
  );
}
