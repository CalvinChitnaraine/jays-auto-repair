import { Link } from "react-router-dom";
import "./navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRole(localStorage.getItem("role"));
        };

        // Listen to changes across tabs or reloads
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole(null);
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <div className="logo-container">
                <img className="logo" src="/images/jays_auto_repair_logo.png" alt="Jay's Auto Repair Logo" />
            </div>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>

                {isLoggedIn && role === "user" && (
                    <li><Link to="/booking">Schedule Appointment</Link></li>
                )}

                {isLoggedIn && (
                    <li><Link to="/profile">Profile</Link></li>
                )}

                {isLoggedIn && role === "admin" && (
                    <li><Link to="/admin">Admin Panel</Link></li>
                )}

                {!isLoggedIn && (
                    <li><Link to="/auth">Sign In / Sign Up</Link></li>
                )}

                {isLoggedIn && (
                    <li className="logout-item">
                        <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;