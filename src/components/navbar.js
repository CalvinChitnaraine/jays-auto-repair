import { Link } from "react-router-dom";
import "./navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Converts token existence to true/false
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        setIsLoggedIn(false); // Update state
        window.location.href = "/"; // Redirect to home page
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
                <li><Link to="/booking">Schedule Appointment</Link></li>

                {/* Show Sign In / Sign Up only when user is NOT logged in */}
                {!isLoggedIn && (
                    <li><Link to="/auth">Sign In / Sign Up</Link></li>
                )}

                {/* Show Logout button only when user IS logged in */}
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