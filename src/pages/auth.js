import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Auth() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isRegistering ? "users" : "login";
        const payload = isRegistering
            ? { first_name: firstName, last_name: lastName, email, password, phone_number: phoneNumber }
            : { email, password };

        try {
            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log("User data from backend:", data.user);

            if (!response.ok) throw new Error(data.error || "Authentication failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role); // Store role
            localStorage.setItem("profile_image", data.user.profile_image);

            navigate("/");
            window.location.reload();
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
                        <>
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </>
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