import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./booking.css";

function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({ name: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser({
            name: `${data.first_name} ${data.last_name}`,
            email: data.email,
          });
        } else {
          console.error("Failed to fetch user info:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchTimes = async () => {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];

        // 1. Get booked times from backend
        const response = await fetch(`http://localhost:5000/bookings/times?date=${dateStr}`);
        const data = await response.json();
        const bookedTimes = data.bookedTimes || [];

        // 2. Generate available times using helper
        const allSlots = generateTimeSlots(selectedDate);

        // 3. Map into dropdown-friendly structure, marking booked slots
        const formattedSlots = allSlots.map((slot) => {
          const [hour, minute] = slot.split(":");
          const value = `${hour.padStart(2, "0")}:${minute}:00`; // match DB format
          const label =
            +hour < 12
              ? `${+hour}:00 AM`
              : +hour === 12
              ? `12:00 PM`
              : `${+hour - 12}:00 PM`;

          return {
            value,
            label,
            disabled: bookedTimes.includes(value),
          };
        });

        setAvailableTimes(formattedSlots);
      } catch (err) {
        console.error("Error fetching or processing times:", err);
      }
    };

    fetchTimes();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate && !serviceDescription.trim()) {
      setError("Please select a date and enter your service issue.");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select a time.");
      return;
    }
    if (!serviceDescription.trim()) {
      setError("Please enter your service issue.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_description: serviceDescription,
          appointment_date: selectedDate.toISOString().split("T")[0],
          appointment_time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to book appointment.");
      } else {
        setError("");
        setServiceDescription("");
        setSelectedDate(null);
        setSelectedTime("");
        setSuccessMessage("Appointment booked! Confirmation email sent.");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // Helper: Generate time slots for a given date
  const generateTimeSlots = (date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    let startHour, endHour;

    switch (day) {
      case 0: // Sunday
        return []; // Closed
      case 6: // Saturday
        startHour = 9;
        endHour = 16;
        break;
      default: // Monday - Friday
        startHour = 9;
        endHour = 18;
    }

    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour}:00`;
      slots.push(time);
    }

    return slots;
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">
        Schedule <span className="highlight">Appointment</span>
      </h2>

      <div className="booking-layout">
        <div className="left-panel">
          <div className="calendar-section">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              minDate={new Date()}
              calendarClassName="custom-calendar"
              className="datepicker"
            />
          </div>
      
          <div className="business-hours-box">
            <h4>Business Hours</h4>
            <ul>
              <li>Mon - Fri: 9:00 AM – 6:00 PM</li>
              <li>Saturday: 9:00 AM – 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
      
        <div className="separator"></div>

        <div className="form-section">
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
            className="time-dropdown"
          >
            <option value="">Select time</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time.value} disabled={time.disabled}>
                {time.label} {time.disabled ? "(Booked)" : ""}
              </option>
            ))}
          </select>

          <textarea
            id="service-description"
            name="service-description"
            placeholder="Describe your issue..."
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            disabled={!selectedDate}
            rows={6}
            className="description-area"
          ></textarea>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;