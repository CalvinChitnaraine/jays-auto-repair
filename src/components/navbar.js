import { Link } from "react-router-dom";
import "./navbar.css"; // add styling later

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/booking">Schedule Appointment</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;