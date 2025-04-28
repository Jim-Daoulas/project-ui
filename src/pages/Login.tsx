import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Login() {
    const {user, token, login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = () => {
        console.log("Login button clicked", email, password);
        
        // Use the URL relative to the baseURL in axiosInstance
        axiosInstance.post("/users/auth/login", {
          email: email,
          password: password
        })
        .then(response => {
            console.log("Login response:", response.data);
          if (response.data && response.data.data) {
            const data = response.data.data;
            console.log("Token:", data.token);
            console.log("User:", data.user);
            console.log("Login successful:", data);
            localStorage.setItem("token", data.token);
            navigate("/");
          } else {
            console.error("Unexpected response format:", response.data);
          }
        })
        .catch(error => {
          console.error("Login failed:", error.response || error);
        });
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