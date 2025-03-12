import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
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
                <li><Link to="/auth">Sign In / Sign Up</Link></li>
                <li className="logout-item"><button className="logout-button">Log Out</button></li> 
            </ul>
        </nav>
    );
}

export default Navbar;