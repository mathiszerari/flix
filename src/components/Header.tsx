import { NavLink } from "react-router-dom";
import { auth } from "../firebase";
import SearchBar from "./search/SearchBar";
import { useEffect, useState } from "react";
import flixlogo from "../assets/images/flix-logo.svg";
import { MdCalendarMonth, MdFavorite, MdNotificationsActive } from "react-icons/md";
import Notification from "../components/notifiation";
import { MdNotifications } from "react-icons/md";

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

export default function Header() {
  const [user, setUser] = useState<any>(null); // Fix type declaration
  const [email, setEmail] = useState<any>(null); // Fix type declaration
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoadingNotification, setIsLoadingNotification] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
      } else {
        setUser(null);
      }
    });

    // Simulate an asynchronous operation with setTimeout
    const timeout = setTimeout(() => {
      setIsLoadingNotification(false);
    }, 1000);

    // Clean up the effect when the component is unmounted
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="hidden">
        {isLoadingNotification ? (
          // Render the loader while the notification state is loading
          <Loader />
        ) : (
          // Render the Notification component when the loading is complete
            <Notification getNotification={setIsNotificationOpen} />
        )}
      </div>
      <header className="flex items-center justify-between backdrop-blur-lg">
        <NavLink to="/">
          <img className="w-16" src={flixlogo} alt="flix app logo" />
        </NavLink>
        <nav className="flex items-center justify-around mt-4 gap-4">
          <SearchBar />
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
              <NavLink to="calendar">
                <MdCalendarMonth className="w-6 h-6" />
              </NavLink>
              {isNotificationOpen ? (
                <>
                  <NavLink to="notification">
                    <MdNotificationsActive className="w-6 h-6" />
                  </NavLink>
                </>
              ) : 
                <NavLink to="notification">
                  <MdNotifications className="w-6 h-6" />
                </NavLink>
              }
              <NavLink to="favorites">
                <MdFavorite className="w-6 h-6" />
              </NavLink>

              <div className="w-12 h-12">
                <NavLink to="profile">
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`}
                    alt=""
                    className="rounded-full"
                  />
                </NavLink>
              </div>
            </>
          ) : null}
        </nav>
      </header>
    </div>
  );
}
