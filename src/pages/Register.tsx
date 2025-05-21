import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        // Reset any previous errors
        setError("");

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Use the register method from AuthContext
            await register({ name, email, password });
            // Navigate to home on successful registration
            navigate("/");
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center vh-100 items-center">
            <form 
                onSubmit={(ev) => {
                    ev.preventDefault();
                    handleRegister();
                }} 
                className="flex flex-col gap-3 w-[350px] p-4 ring-1 ring-gray-500"
            >
                <h1>Register</h1>
                
                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Name" 
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        required
                    />
                </label>
                
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                        type="email" 
                        className="grow" 
                        placeholder="Email" 
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        required
                    />
                </label>
                
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                        type="password" 
                        className="grow" 
                        placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        minLength={6}
                    />
                </label>
                
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                        type="password" 
                        className="grow" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                        required
                    />
                </label>
                
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
}

export default Register;