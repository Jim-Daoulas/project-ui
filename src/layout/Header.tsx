import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header(showTitle = true) {
  const {user, logout}=useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });
  };
  console.log("User in Header:", user);
  console.log("User properties:", user ? Object.keys(user) : 'no user');
    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
        <Link to="/">
                  {showTitle && (
        <div className="mb-8 pt-8 px-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">League of Legends Rework Vault</h1>
        </div>
      )}
        </Link>
        </div>
        <div className="flex gap-2">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        {
          user && user.name
          ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><span>Hello, {user.name}</span></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )
          : (
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
            </ul>
          </div>
          )
        
        }
        </div>
      </div>
    );
  }
  
  export default Header;