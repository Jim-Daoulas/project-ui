import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ValidationErrors {
    email?: string[];
    password?: string[];
}

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Client-side validation function
    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        // Email validation
        if (!email.trim()) {
            errors.email = ["Email is required"];
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = ["Please enter a valid email address"];
            }
        }

        // Password validation
        if (!password) {
            errors.password = ["Password is required"];
        } else if (password.length < 6) {
            errors.password = ["Password must be at least 6 characters long"];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onLogin = async () => {
        // Reset previous errors
        setError("");
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Use the login method from AuthContext
            await login({ email: email.trim(), password });
            navigate("/");
        } catch (error: any) {
            console.error("Login failed:", error);
            
            // Handle server validation errors
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Login failed. Please check your credentials and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get field error
    const getFieldError = (field: keyof ValidationErrors): string | undefined => {
        return validationErrors[field]?.[0];
    };

    // Helper function to check if field has error
    const hasFieldError = (field: keyof ValidationErrors): boolean => {
        return !!(validationErrors[field] && validationErrors[field]!.length > 0);
    };

    return (
        <div className="flex justify-center vh-100 items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <form 
                onSubmit={(ev) => {
                    ev.preventDefault();
                    onLogin();
                }} 
                className="flex flex-col gap-4 w-[400px] p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700"
            >
                <h1 className="text-2xl font-bold text-white text-center mb-4">Welcome Back</h1>
                
                {/* General error message */}
                {error && (
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Email field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Email *</span>
                    </label>
                    <input 
                        type="email" 
                        className={`input input-bordered w-full bg-gray-700 text-white ${
                            hasFieldError('email') ? 'input-error border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Enter your email address" 
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value);
                            // Clear field error on change
                            if (hasFieldError('email')) {
                                setValidationErrors(prev => ({ ...prev, email: undefined }));
                            }
                        }}
                        disabled={isLoading}
                        autoComplete="email"
                    />
                    {hasFieldError('email') && (
                        <label className="label">
                            <span className="label-text-alt text-red-400">{getFieldError('email')}</span>
                        </label>
                    )}
                </div>
                
                {/* Password field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Password *</span>
                    </label>
                    <input 
                        type="password" 
                        className={`input input-bordered w-full bg-gray-700 text-white ${
                            hasFieldError('password') ? 'input-error border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value);
                            // Clear field error on change
                            if (hasFieldError('password')) {
                                setValidationErrors(prev => ({ ...prev, password: undefined }));
                            }
                        }}
                        disabled={isLoading}
                        autoComplete="current-password"
                    />
                    {hasFieldError('password') && (
                        <label className="label">
                            <span className="label-text-alt text-red-400">{getFieldError('password')}</span>
                        </label>
                    )}
                </div>
                
                {/* Submit button */}
                <button 
                    type="submit" 
                    className={`btn btn-primary mt-4 ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>

                {/* Register link */}
                <div className="text-center mt-4">
                    <span className="text-gray-400">Don't have an account? </span>
                    <a href="/register" className="link link-primary">Create one here</a>
                </div>
            </form>
        </div>
    );
}

export default Login;