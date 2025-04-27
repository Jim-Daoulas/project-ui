import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

function Header() {
  const {user}=useAuth();
    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
        <Link to="/">
                  Home
        </Link>
        </div>
        <div className="flex gap-2">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          {
            user
            ? <p>Hello, {user.name}</p>
            :
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <NavLink to="/login">
                  Login
                </NavLink>
                
              </li>
              <li>
                <NavLink to="/register">
                 Register
                </NavLink>
                
              </li>
              {/*<li><a>Logout</a></li>*/}
            </ul>
          </div>
          }
        

        </div>
      </div>
    );
  }
  
  export default Header;