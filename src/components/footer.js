import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p> Work Phone: (416)-412-7460</p>
                    <p> Personal Phone: (416)-402-0901</p>
                    <p> Email: jaychitnaraine@rogers.com</p>
                    <p> Address: 100 Melford Dr Unit 8, Scarborough, ON M1B 2G4</p>
                </div>
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Jay's Auto Repair. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
