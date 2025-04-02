import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Booking from "./pages/booking";
import Auth from "./pages/auth";
import Footer from "./components/footer";
import Profile from "./pages/profile";
import Admin from "./pages/admin";



function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;