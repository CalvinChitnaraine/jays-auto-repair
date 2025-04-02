const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Ensure the token starts with "Bearer "
    const token = authHeader.split(" ")[1]; // Extracts the actual token

    if (!token) {
        return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "You have access to this protected route!", user: req.user });
});

// Get all bookings with user info (admin only)
app.get("/admin/bookings", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Join bookings with user info
    const result = await pool.query(
      `SELECT b.id AS booking_id, u.first_name, u.last_name, u.email, b.service_description, b.appointment_date, b.appointment_time
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       ORDER BY b.appointment_date, b.appointment_time`
    );

    res.json({ bookings: result.rows });
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ error: "Server error. Could not fetch bookings." });
  }
});

// Get all users (admin only)
app.get("/admin/users", verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Exclude password
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone_number, role FROM users ORDER BY last_name`
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Server error. Could not fetch users." });
  }
});

app.delete("/admin/users/:id", verifyToken, async (req, res) => {
  const targetId = parseInt(req.params.id);
  const requesterId = req.user.id;

  try {
    // Check if requester is admin
    const requester = await pool.query("SELECT role FROM users WHERE id = $1", [requesterId]);
    if (requester.rows[0].role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Prevent admin from deleting themselves
    if (targetId === requesterId) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = $1", [targetId]);
    res.json({ message: "User account deleted." });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Server error. Could not delete user." });
  }
});

app.delete("/admin/bookings/:id", verifyToken, async (req, res) => {
  const requesterId = req.user.id;
  const bookingId = parseInt(req.params.id);

  try {
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [requesterId]);
    if (userResult.rows[0].role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    await pool.query("DELETE FROM bookings WHERE id = $1", [bookingId]);
    res.json({ message: "Booking deleted." });
  } catch (err) {
    console.error("Error deleting booking:", err.message);
    res.status(500).json({ error: "Server error. Could not delete booking." });
  }
});


// Add User Route (Sign Up)
app.post("/users", async (req, res) => {
    console.log("Received request body:", req.body);
    const { email, first_name, last_name, password, phone_number } = req.body;
  
    if (!email || !first_name || !last_name || !password || !phone_number) {
      return res.status(400).json({ error: "Missing fields" });
    }
  
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      console.log("Original Password:", password);
      console.log("Hashed Password:", hashedPassword);
  
      const newUser = await pool.query(
        "INSERT INTO users (email, first_name, last_name, password, phone_number, profile_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [email, first_name, last_name, hashedPassword, phone_number, "profileimg1"] // default
      );
  
      const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "3h" });

      res.json({ token, user: newUser.rows[0] });
    } catch (err) {
      console.error("Database error:", err.message); // Log the actual error
      res.status(500).json({ error: err.message }); // Send the error message to the user
    }
  }
);
  

// Get All Users Route
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        // Log passwords to debug bcrypt issue
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.rows[0].password);

        // Compare entered password with hashed password in database
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            console.log("Password comparison failed!");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log("Password matched successfully!");

        // Generate JWT Token
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        res.json({ token, user: user.rows[0] });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error");
    }
});

app.put("/users/profile-image", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { profile_image } = req.body;

  if (!profile_image) {
      return res.status(400).json({ error: "No image selected" });
  }

  try {
      const result = await pool.query(
          "UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING *",
          [profile_image, userId]
      );
      res.json({ message: "Profile image updated", user: result.rows[0] });
  } catch (err) {
      console.error("Error updating profile image:", err.message);
      res.status(500).json({ error: "Server error" });
  }
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaydoesautorepair@gmail.com", // business Email
        pass: process.env.GMAIL_APP_PASSWORD // using .env to keep it safe
      }
    });

    // Compose email
    const mailOptions = {
      from: email, // sender’s email (user input)
      to: "jaydoesautorepair@gmail.com", // business inbox
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({ error: "Failed to send message." });
  }
});

app.get("/users/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT id, first_name, last_name, email, phone_number, role, profile_image FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user info:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Booking route 
app.post("/bookings", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { service_description, appointment_date, appointment_time } = req.body;

  if (!service_description || !appointment_date) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Get the user's email and name for confirmation
    const userResult = await pool.query(
      "SELECT first_name, email FROM users WHERE id = $1",
      [userId]
    );

    const user = userResult.rows[0];

    // Store the booking
    const newBooking = await pool.query(
      "INSERT INTO bookings (user_id, service_description, appointment_date, appointment_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, service_description, appointment_date, appointment_time]
    );

    // ✉️ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaydoesautorepair@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });


    // Sanity check before parsing the time
    if (!appointment_time) {
      console.error("Missing appointment_time when formatting fullDateTime.");
      return res.status(400).json({ error: "Invalid or missing appointment time." });
    }
    
    const [year, month, day] = appointment_date.split("-");
    // Split time with fallback
    const [hour, minute, second = "00"] = appointment_time.split(":");
    
    // Construct safe full Date
    const fullDateTime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
    
    // Validate date
    if (isNaN(fullDateTime.getTime())) {
      console.error("Invalid date constructed:", fullDateTime);
      return res.status(400).json({ error: "Invalid date format." });
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Toronto'
    }).format(fullDateTime);   

    const mailOptions = {
      from: "jaydoesautorepair@gmail.com",
      to: user.email,
      subject: "Appointment Confirmation - Jay's Auto Repair",
      text: `Hello ${user.first_name},\n\nThank you for booking an appointment with Jay's Auto Repair.\n\nHere are your details:\n- Date: ${formattedDate}\n- Issue: ${service_description}\n\nIf you have any questions or want to reschedule, feel free to reply to this email and please don't hesitate call us.\n\nBest regards,\nJay's Auto Repair`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Booking created successfully. Confirmation email sent.",
      booking: newBooking.rows[0]
    });
  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(500).json({ error: "Server error. Could not create booking." });
  }
});

app.get("/bookings/times", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing date parameter." });
  }

  try {
    // Fetch all appointment times for the given date
    const result = await pool.query(
      "SELECT appointment_time FROM bookings WHERE appointment_date = $1",
      [date]
    );

    const bookedTimes = result.rows.map((row) => row.appointment_time);

    res.json({ bookedTimes });
  } catch (err) {
    console.error("Error fetching booked times:", err.message);
    res.status(500).json({ error: "Server error. Could not fetch booked times." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
