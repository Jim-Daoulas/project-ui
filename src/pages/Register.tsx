import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Register() {
    const { register, loading, error } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLocalError("");

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        try {
            await register({ name, email, password });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800">
            <div className="max-w-md w-full mx-4">
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400">Join the League of Legends community</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {(error || localError) && (
                            <div className="alert alert-error">
                                <span>{error || localError}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Name</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500" 
                                placeholder="Enter your name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Email</span>
                            </label>
                            <input 
                                type="email" 
                                className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Password</span>
                            </label>
                            <input 
                                type="password" 
                                className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Confirm Password</span>
                            </label>
                            <input 
                                type="password" 
                                className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500" 
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;