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
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    // Helper function to get first error for a field
    const getFieldError = (field: string): string => {
        return validationErrors[field]?.[0] || "";
    };

    // Client-side validation that matches Laravel rules
    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        // Name validation - matches Laravel 'required|string'
        if (!name || !name.trim()) {
            errors.name = ["The name field is required."];
        }

        // Email validation - matches Laravel 'required|string|unique:users,email'
        if (!email || !email.trim()) {
            errors.email = ["The email field is required."];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = ["The email must be a valid email address."];
        }

        // Password validation - matches Laravel 'required|string|min:6'
        if (!password) {
            errors.password = ["The password field is required."];
        } else if (password.length < 6) {
            errors.password = ["The password must be at least 6 characters."];
        }

        // Confirm password - custom validation (not in API)
        if (!confirmPassword) {
            errors.confirmPassword = ["Please confirm your password."];
        } else if (password !== confirmPassword) {
            errors.confirmPassword = ["Passwords do not match."];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async () => {
        // Reset errors
        setError("");
        setValidationErrors({});

        // Basic client-side validation
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            console.log('Sending registration data:', { name, email, password });
            
            // Use the register method from AuthContext
            await register({ name, email, password });
            // Navigate to home on successful registration
            navigate("/");
        } catch (error: any) {
            console.error("Registration failed:", error);
            
            // Handle Laravel validation errors
            if (error.response?.status === 422) {
                // Laravel validation errors format: { "errors": { "email": ["The email has already been taken."] } }
                const serverErrors = error.response.data.errors || {};
                setValidationErrors(serverErrors);
                
                // Show general error message
                const errorMessages = Object.values(serverErrors).flat() as string[];
                setError(errorMessages.length > 1 ? "Please fix the errors below." : errorMessages[0] || "");
                
            } else if (error.response?.data?.message) {
                // Other server errors
                setError(error.response.data.message);
            } else {
                // Network or other errors
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center vh-100 items-center">
            <form 
                onSubmit={(ev) => {
                    ev.preventDefault();
                    handleRegister();
                }} 
                className="flex flex-col gap-3 w-[350px] p-4 ring-1 ring-gray-500 rounded-lg"
            >
                <h1 className="text-xl font-bold text-center mb-4">Register</h1>
                
                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Name Field */}
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                            type="text" 
                            className="grow" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(ev) => {
                                setName(ev.target.value);
                                // Clear field error on change
                                if (validationErrors.name) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.name;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                        />
                    </label>
                    {getFieldError('name') && (
                        <div className="text-error text-sm mt-1">
                            {getFieldError('name')}
                        </div>
                    )}
                </div>
                
                {/* Email Field */}
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                            type="email" 
                            className="grow" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(ev) => {
                                setEmail(ev.target.value);
                                // Clear field error on change
                                if (validationErrors.email) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.email;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                        />
                    </label>
                    {getFieldError('email') && (
                        <div className="text-error text-sm mt-1">
                            {getFieldError('email')}
                        </div>
                    )}
                </div>
                
                {/* Password Field */}
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                            type="password" 
                            className="grow" 
                            placeholder="Password (min 6 chars)"
                            value={password}
                            onChange={(ev) => {
                                setPassword(ev.target.value);
                                // Clear field error on change
                                if (validationErrors.password) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.password;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                            minLength={6}
                        />
                    </label>
                    {getFieldError('password') && (
                        <div className="text-error text-sm mt-1">
                            {getFieldError('password')}
                        </div>
                    )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                            type="password" 
                            className="grow" 
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(ev) => {
                                setConfirmPassword(ev.target.value);
                                // Clear field error on change
                                if (validationErrors.confirmPassword) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.confirmPassword;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                        />
                    </label>
                    {getFieldError('confirmPassword') && (
                        <div className="text-error text-sm mt-1">
                            {getFieldError('confirmPassword')}
                        </div>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                {/* Login Link */}
                <div className="text-center mt-4">
                    <span className="text-sm">Already have an account? </span>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-primary hover:underline text-sm"
                    >
                        Login here
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;