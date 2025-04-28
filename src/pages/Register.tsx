import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = () => {
        if (password !== confirmPassword){
            alert("password not match");
            return;
        }
        axiosInstance.post("/users/auth/register", {name, email, password})
        .then(response => {
            console.log(response);
        })
    };

    return (


        <div className="flex justify-center vh-100 items-center">
            <form onSubmit={(ev) => ev.preventDefault} className="flex flex-col gap-3 w-[350px] p-4 ring-1 ring-gray-500">
                <h1>Register</h1>
                <label className="input input-bordered flex-items-center gap-2">
                    <input 
                    type="text" 
                    className="grow" 
                    placeholder="Name" 
                    value={name}
                    onChange={(ev) => {setName(ev.target.value)}}
                    />
                </label>
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
                <label className="input input-bordered flex-items-center gap-2">
                    <input type="password" 
                    className="grow" 
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(ev) => {setConfirmPassword(ev.target.value)}}
                    />
                </label>
                <button className="btn btn-primary" onClick={register}>Register</button>
            </form>
        </div>
    );

}

export default Register;