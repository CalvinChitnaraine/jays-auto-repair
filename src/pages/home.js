import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="banner">
                <div class="banner-slide">
                    <img src="/images/jays_auto_repair_banner_1.jpg" alt="Jay's Auto Repair Banner 1"  />
                    <img src="/images/jays_auto_repair_banner_2.jpg" alt="Jay's Auto Repair Banner 2"  />
                    <img src="/images/jays_auto_repair_banner_3.jpg" alt="Jay's Auto Repair Banner 3"  />
                    <img src="/images/jays_auto_repair_banner_4.jpg" alt="Jay's Auto Repair Banner 4"  />
                    <img src="/images/jays_auto_repair_banner_5.jpg" alt="Jay's Auto Repair Banner 5"  />
                </div>
                <div class="banner-slide">
                    <img src="/images/jays_auto_repair_banner_1.jpg" alt="Jay's Auto Repair Banner 1"  />
                    <img src="/images/jays_auto_repair_banner_2.jpg" alt="Jay's Auto Repair Banner 2"  />
                    <img src="/images/jays_auto_repair_banner_3.jpg" alt="Jay's Auto Repair Banner 3"  />
                    <img src="/images/jays_auto_repair_banner_4.jpg" alt="Jay's Auto Repair Banner 4"  />
                    <img src="/images/jays_auto_repair_banner_5.jpg" alt="Jay's Auto Repair Banner 5"  />
                </div>
            </div>

            <div className="home-container">
                {/* Hero Section */}
                <section className="hero">
                <div className="hero-content">
                    <h1>
                        <span className="hero-bold">Reliable</span> and <span className="hero-highlight">Affordable</span>
                    </h1>
                    <p>Serving the community with expert car maintenance and repair services.</p>

                    {/* ✅ Booking Card */}
                    <div className="booking-card">
                        <div className="booking-icon">✔</div>
                        <h2>Book an Appointment</h2>
                        <button className="booking-button" onClick={() => navigate("/auth")}>
                            Schedule Appointment
                        </button>
                    </div>
                </div>

                {/* ✅ Right-Side Image */}
                <div className="hero-image">
                    <img src="/images/jays_auto_repair_hero.jpg" alt="Hero Section Illustration" />
                </div>
            </section>

                {/* Services Section */}
                <section className="services">
                    <h2><span>Services</span> <span className="highlight">We Offer</span></h2>
                    <hr className="divider" />
                    <div className="service-container">
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_oil_change.png" alt="Oil Changes" />
                            <p>Oil Changes</p>
                        </div>
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_brakes_tires.jpg" alt="Brake & Tire Services" />
                            <p>Brake & Tire Services</p>
                        </div>
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_engine.jpg" alt="Engine Diagnostics & Repairs" />
                            <p>Engine Diagnostics & Repairs</p>
                        </div>
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_battery_replace.jpg" alt="Battery Replacement" />
                            <p>Battery Replacement</p>
                        </div>
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_air_filter.jpg" alt="Air Filter" />
                            <p>Air Filter</p>
                        </div>
                        <div className="service-card">
                            <img src="/images/jays_auto_repair_and_more.jpeg" alt="And More" />
                            <p>And More!</p>
                        </div>
                    </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="reviews-section">
                    <h2><span>What Our</span> <span className="highlight">Customers Say</span></h2>
                    <script src="https://static.elfsight.com/platform/platform.js" async></script>
                    <div class="elfsight-app-8cd9a191-000f-4142-8d5b-64f27c744ec9" data-elfsight-app-lazy></div>
                </section>
            </div>
        </div>
    );
}

export default Home;