import { useState } from "react";
import "./auth.css";

function Auth({ setIsLoggedIn }) {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoggedIn(true); // Simulating login, replace with real authentication logic
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h3>{isRegistering ? "Create an Account" : "Welcome Back"}</h3>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="input-field">
                            <input type="text" required />
                            <label>Enter your name</label>
                        </div>
                    )}
                    <div className="input-field">
                        <input type="email" required />
                        <label>Enter your email</label>
                    </div>
                    <div className="input-field">
                        <input type="password" required />
                        <label>Enter your password</label>
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
