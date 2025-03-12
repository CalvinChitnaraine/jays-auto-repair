import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Booking from "./pages/booking";
import Auth from "./pages/auth";
import Footer from "./components/footer";



function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;