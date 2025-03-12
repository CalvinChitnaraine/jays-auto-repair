const bcrypt = require("bcryptjs");

const testPassword = "securepassword"; // Original password
const storedHashedPassword = "$2b$10$jTOoQ4atjKz/WLwbl.Y3/egrTW8aAOKaNgVHIDNldjnm0q.37CPny"; // Replace with actual DB password

bcrypt.compare(testPassword, storedHashedPassword, (err, isMatch) => {
    if (err) {
        console.error("Error comparing passwords:", err);
    } else if (isMatch) {
        console.log("Passwords match!");
    } else {
        console.log("Passwords do NOT match!");
    }
});
