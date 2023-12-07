import { NavLink } from "react-router-dom";
import { auth } from "../firebase";

export default function Header() {
    const email = auth.currentUser?.email
    console.log(email);
    

  return (
    <header>
      <nav className="flex items-center justify-around mt-4">
        <NavLink to="shows/1">Shows</NavLink>
        <NavLink to="calendar">Calendar</NavLink>
        <NavLink to="profile">Profile</NavLink>
        
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
            <div className='w-12 h-12'>
                <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`} alt=""
                className="rounded-full"          />
            </div>
            {/* Ajoutez d'autres éléments que vous souhaitez afficher pour un utilisateur connecté */}
          </>
        ) : (
          // Contenu à afficher si l'utilisateur n'est pas connecté
          <>
            <NavLink to="login">Login</NavLink>
            <NavLink to="signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
