import { NavLink } from "react-router-dom";

export default function Header(){
    return(
        <header>
            <nav>
                <NavLink to="shows/1">Shows</NavLink>
                <NavLink to="calendar">Calendar</NavLink>
                <NavLink to="profile">Profile</NavLink>
                <NavLink to="login">Login</NavLink>
                <NavLink to="signup">Signup</NavLink>
            </nav>
        </header>
    )
}