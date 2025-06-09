import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {
    const { login, loading, error } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await login({ email, password });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800">
            <div className="max-w-md w-full mx-4">
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    <form onSubmit={onLogin} className="space-y-6">
                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

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

                        <button 
                            type="submit" 
                            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Test Credentials */}
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Test any existing user from your database</h3>
                        <div className="text-xs text-gray-400">
                            <p>Use any email/password combination from your users table</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;