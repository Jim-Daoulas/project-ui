import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ValidationErrors {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
}

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Client-side validation function
    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        // Name validation
        if (!name.trim()) {
            errors.name = ["Name is required"];
        } else if (name.length > 255) {
            errors.name = ["Name cannot be longer than 255 characters"];
        }

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

        // Confirm password validation
        if (!confirmPassword) {
            errors.confirmPassword = ["Please confirm your password"];
        } else if (password !== confirmPassword) {
            errors.confirmPassword = ["Passwords do not match"];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async () => {
        // Reset previous errors
        setError("");
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Use the register method from AuthContext
            await register({ name: name.trim(), email: email.trim(), password });
            // Navigate to home on successful registration
            navigate("/");
        } catch (error: any) {
            console.error("Registration failed:", error);
            
            // Handle server validation errors
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Registration failed. Please try again.");
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
                    handleRegister();
                }} 
                className="flex flex-col gap-4 w-[400px] p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700"
            >
                <h1 className="text-2xl font-bold text-white text-center mb-4">Create Account</h1>
                
                {/* General error message */}
                {error && (
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Name field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Name *</span>
                    </label>
                    <input 
                        type="text" 
                        className={`input input-bordered w-full bg-gray-700 text-white ${
                            hasFieldError('name') ? 'input-error border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Enter your full name" 
                        value={name}
                        onChange={(ev) => {
                            setName(ev.target.value);
                            // Clear field error on change
                            if (hasFieldError('name')) {
                                setValidationErrors(prev => ({ ...prev, name: undefined }));
                            }
                        }}
                        disabled={isLoading}
                        maxLength={255}
                    />
                    {hasFieldError('name') && (
                        <label className="label">
                            <span className="label-text-alt text-red-400">{getFieldError('name')}</span>
                        </label>
                    )}
                </div>
                
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
                        placeholder="Choose a strong password"
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value);
                            // Clear field error on change
                            if (hasFieldError('password')) {
                                setValidationErrors(prev => ({ ...prev, password: undefined }));
                            }
                        }}
                        disabled={isLoading}
                        minLength={6}
                    />
                    {hasFieldError('password') && (
                        <label className="label">
                            <span className="label-text-alt text-red-400">{getFieldError('password')}</span>
                        </label>
                    )}
                    {!hasFieldError('password') && password.length > 0 && password.length < 6 && (
                        <label className="label">
                            <span className="label-text-alt text-yellow-400">Password should be at least 6 characters</span>
                        </label>
                    )}
                </div>
                
                {/* Confirm Password field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Confirm Password *</span>
                    </label>
                    <input 
                        type="password" 
                        className={`input input-bordered w-full bg-gray-700 text-white ${
                            hasFieldError('confirmPassword') ? 'input-error border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(ev) => {
                            setConfirmPassword(ev.target.value);
                            // Clear field error on change
                            if (hasFieldError('confirmPassword')) {
                                setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                            }
                        }}
                        disabled={isLoading}
                    />
                    {hasFieldError('confirmPassword') && (
                        <label className="label">
                            <span className="label-text-alt text-red-400">{getFieldError('confirmPassword')}</span>
                        </label>
                    )}
                    {!hasFieldError('confirmPassword') && confirmPassword.length > 0 && password !== confirmPassword && (
                        <label className="label">
                            <span className="label-text-alt text-yellow-400">Passwords do not match</span>
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
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>

                {/* Login link */}
                <div className="text-center mt-4">
                    <span className="text-gray-400">Already have an account? </span>
                    <a href="/login" className="link link-primary">Sign in here</a>
                </div>
            </form>
        </div>
    );
}

export default Register;