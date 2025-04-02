import React, { useEffect, useState } from "react";
import "./admin.css"; // We'll create this next

function Admin() {
  const [view, setView] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null); // Logged-in user
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Get logged-in user ID
    fetch("http://localhost:5000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        fetchData(view);
      })
      .catch((err) => setError("Failed to verify admin."));
  }, [view]);

  const fetchData = async (type) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (type === "bookings") setBookings(data.bookings);
      else setUsers(data.users);
    } catch (err) {
      setError("Failed to fetch data.");
    }
  };

  const deleteRecord = async (type, id) => {
    if (type === "users" && id === userId) {
      alert("You cannot delete your own admin account.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this record?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      alert(data.message);
      fetchData(type);
    } catch (err) {
      setError("Failed to delete record.");
    }
  };

  return (
    <div className="admin-container">
      <h2>
        Admin <span className="highlight">Dashboard</span>
      </h2>

      <div className="toggle-buttons">
        <button
          className={view === "bookings" ? "active" : ""}
          onClick={() => setView("bookings")}
        >
          View Bookings
        </button>
        <button
          className={view === "users" ? "active" : ""}
          onClick={() => setView("users")}
        >
          View Users
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {view === "bookings" ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Issue</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.booking_id}>
                <td>{b.first_name}</td>
                <td>{b.last_name}</td>
                <td>{b.email}</td>
                <td>{b.service_description}</td>
                <td>{b.appointment_date} @ {b.appointment_time.slice(0, 5)}</td>
                <td>
                  <button onClick={() => deleteRecord("bookings", b.booking_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.email}</td>
                <td>{u.phone_number}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => deleteRecord("users", u.id)} disabled={u.id === userId}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;