import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async () => {
        try {
            // Χρησιμοποιούμε τη μέθοδο login από το AuthContext
            await login({ email, password });
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex justify-center vh-100 items-center">
            <form onSubmit={(ev) => {
                ev.preventDefault();
                onLogin();
                }} className="flex flex-col gap-3 w-[350px] p-4 ring-1 ring-gray-500">
                <h1>Login</h1>
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                    type="text" 
                    className="grow" 
                    placeholder="Email" 
                    value={email}
                    onChange={(ev) => {setEmail(ev.target.value)}}
                    />
                </label>
                <label className="input input-bordered flex-items-center gap-2">
                    <input type="password" 
                    className="grow" 
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => {setPassword(ev.target.value)}}
                    />
                </label>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;