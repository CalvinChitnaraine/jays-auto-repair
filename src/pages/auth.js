import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Auth() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Used to navigate after login

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isRegistering ? "users" : "login";
        const payload = { email, password };

        try {
            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Authentication failed");
            }

            // Store JWT token & redirect
            localStorage.setItem("token", data.token);
            navigate("/"); // Redirect to homepage
            window.location.reload(); // Ensure Navbar updates
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h3>{isRegistering ? "Create an Account" : "Welcome Back"}</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="input-field">
                            <input type="text" placeholder="Enter your name" required />
                        </div>
                    )}
                    <div className="input-field">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{isRegistering ? "Register" : "Login"}</button>
                    <p className="toggle-auth">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                        <span onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? "Login" : "Register"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Auth;