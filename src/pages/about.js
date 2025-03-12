import "./about.css";

function About() {
    return (
        <div className="about-page">
            {/* Who We Are Section */}
            <section className="who-we-are">
                <div className="content">
                    <h2>
                        <span className="title-bold who-highlight">Who</span> <span className="title-highlight">We Are</span>
                    </h2>
                    <p>
                        At Jay’s Auto Repair, we pride ourselves on providing honest, affordable, and expert automotive services. 
                        With over 26 years of experience, we have been serving the community with reliable car maintenance and repair. 
                        Our mission is to deliver high-quality, affordable, and trustworthy repair services.
                    </p>
                </div>
                <img src="/images/jays_auto_repair_working.jpg" alt="Jay working on a car" />
            </section>

            {/* Meet the Owner Section */}
            <section className="meet-the-owner">
                <img src="/images/jays_auto_repair_portrait.jpg" alt="Jay, the owner of Jay's Auto Repair" />
                <div className="content">
                    <h2>
                        <span className="title-bold">Meet The</span> <span className="owner-highlight">Owner</span>
                    </h2>
                    <p>
                        Jay was born in Guyana and at a young age, always had an interest in cars. He took that passion to Canada 
                        in his late-20s and quickly started his business from the ground up. Jay is very social and friendly and 
                        would love to get to know you better on a personal level.
                    </p>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-section">
              <h2 className="why-choose-title">
                Why Choose <span className="why-highlight">Jay's Auto Repair?</span>
              </h2>

              <div className="why-choose-container">
                <div className="why-choose-item">
                  <div className="why-choose-icon">
                    <img src="/images/icons/trophy_icon.png" alt="Experience" />
                  </div>
                  <h3>High Level of Experience</h3>
                  <p>26 years of experience</p>
                </div>

                <div className="why-choose-item">
                  <div className="why-choose-icon">
                    <img src="/images/icons/customer_icon.png" alt="Customers" />
                  </div>
                  <h3>Our Customers</h3>
                  <p>Plenty of satisfied customers</p>
                </div>

                <div className="why-choose-item">
                  <div className="why-choose-icon">
                    <img src="/images/icons/turnaround_icon.png" alt="Fast Turnaround" />
                  </div>
                  <h3>Fast Turnaround Time</h3>
                  <p>Able to detect and diagnose problems quickly</p>
                </div>

                <div className="why-choose-item">
                  <div className="why-choose-icon">
                    <img src="/images/icons/handshake_icon.png" alt="Client Relationship" />
                  </div>
                  <h3>Client Relationship</h3>
                  <p>Very honest and transparent with customers</p>
                </div>
              </div>
            </section>
        </div>
    );
}

export default About;
