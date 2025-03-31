const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error("Database error:", err.message); // Log the actual error
      res.status(500).json({ error: err.message }); // Send the error message to the client
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
            console.log("Password comparison failed! ❌");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log("Password matched successfully! ✅");

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
