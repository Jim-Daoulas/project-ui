import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgression } from "../hooks/useProgression";
import SimpleProgress from "../components/SimpleProgress";
import SimpleUnlockShop from "../components/SimpleUnlockShop";

function Header() {
  const { user, logout } = useAuth();
  const { progress, canClaimDailyBonus, claimDailyBonus } = useProgression();
  const navigate = useNavigate();
  const [showUnlockShop, setShowUnlockShop] = useState(false);

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });
  };

  const handleDailyBonus = async () => {
    const result = await claimDailyBonus();
    if (result && result.points_earned) {
      console.log('Daily bonus claimed:', result);
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold">
            LoL Rework Vault
          </Link>
        </div>
        
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            placeholder="Search" 
            className="input input-bordered w-24 md:w-auto" 
          />
          
          {user && user.name ? (
            <>
              {/* Progress Bar - Compact Version */}
              {progress && (
                <div className="hidden lg:block">
                  <SimpleProgress compact={true} />
                </div>
              )}

              {/* Daily Bonus Button */}
              {canClaimDailyBonus && (
                <button
                  onClick={handleDailyBonus}
                  className="btn btn-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 hover:from-yellow-600 hover:to-orange-600 animate-pulse"
                  title="Claim Daily Bonus (+5 points)"
                >
                  🎁
                </button>
              )}

              {/* Unlock Shop Button */}
              <button
                onClick={() => setShowUnlockShop(true)}
                className="btn btn-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700"
                title="Unlock Shop"
              >
                🛒
              </button>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User avatar"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li className="menu-title">
                    <span>Hello, {user.name}</span>
                  </li>
                  
                  {progress && (
                    <>
                      <li className="disabled">
                        <span className="flex items-center gap-2">
                          <span className="text-blue-500">⭐</span>
                          <span>{progress.total_points} points</span>
                        </span>
                      </li>
                      <li className="disabled">
                        <span className="flex items-center gap-2">
                          <span className="text-purple-500">⚔️</span>
                          <span>{progress.unlocked_champions_count}/{progress.total_champions} Champions</span>
                        </span>
                      </li>
                      <li className="disabled">
                        <span className="flex items-center gap-2">
                          <span className="text-yellow-500">🎨</span>
                          <span>{progress.unlocked_skins_count}/{progress.total_skins} Skins</span>
                        </span>
                      </li>
                      <div className="divider my-1"></div>
                    </>
                  )}
                  
                  <li>
                    <button 
                      onClick={() => setShowUnlockShop(true)}
                      className="flex items-center gap-2"
                    >
                      <span>🛒</span>
                      <span>Unlock Shop</span>
                    </button>
                  </li>
                  
                  {canClaimDailyBonus && (
                    <li>
                      <button 
                        onClick={handleDailyBonus}
                        className="flex items-center gap-2 text-yellow-600"
                      >
                        <span>🎁</span>
                        <span>Daily Bonus (+5)</span>
                      </button>
                    </li>
                  )}
                  
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogout}>
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Guest avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <NavLink to="/login" className="flex items-center gap-2">
                    <span>🔑</span>
                    <span>Login</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="flex items-center gap-2">
                    <span>📝</span>
                    <span>Register</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Unlock Shop Modal */}
      <SimpleUnlockShop 
        isOpen={showUnlockShop} 
        onClose={() => setShowUnlockShop(false)} 
      />
    </>
  );
}

export default Header;