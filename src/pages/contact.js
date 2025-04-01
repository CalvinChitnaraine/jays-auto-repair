import React, { useState } from "react";
import "./contact.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [statusMessage, setStatusMessage] = useState(""); // success or error
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("Email sent successfully!");
        setStatusType("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusMessage(data.error || "Something went wrong.");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMessage("Failed to send email.");
      setStatusType("error");
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 5000);
  };

  return (
    <div className="contact-container">
      {/* Banner */}
      <div className="contact-banner">
        <h1 className="banner-title">CONTACT</h1>
      </div>

      {/* Content */}
      <div className="contact-content">
        {/* Left side: form and message */}
        <div className="contact-form-section">
          <h2 className="say-hi">
            Say <span className="highlight">Hi!</span>
          </h2>
          <p className="contact-intro">
            Don't hesitate to send us a message! We'll get back to you shortly and will be more than happy to discuss and answer any questions you may have.
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              placeholder="Message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="submit-btn">Submit</button>
          
            {/* Status Message */}
            {statusMessage && (
              <p className={`status-message ${statusType}`}>{statusMessage}</p>
            )}
          </form>
        </div>

        {/* Right side: contact info */}
        <div className="contact-info">
          <h4>Contacts</h4>
          <p className="contact-email">jaydoesautorepair@gmail.com</p>
          <p className="contact-phone">(705) 123-4567</p>

          <h4 className="hours-heading">Business Hours</h4>
            <p className="business-hours">
              Monday-Friday :    9 a.m.-6 p.m{"\n"}
              Saturday      :    9 a.m.-4 p.m{"\n"}
              Wednesday:  9 a.m.-6 p.m{"\n"}
              Thursday:   9 a.m.-6 p.m{"\n"}
              Friday:     9 a.m.-6 p.m{"\n"}
              Saturday:   9 a.m.-4 p.m{"\n"}
              Sunday:     Closed
            </p>
          <p className="business-hours-note">
            Please contact us to schedule an appointment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;