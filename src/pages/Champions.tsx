// pages/Champions.tsx
import { Link } from 'react-router-dom';
import ChampionsList from '../components/ChampionsList';
import { useAuth } from '../context/AuthContext';

const Champions = () => {
  const { user } = useAuth();

  // ✅ Αν είναι guest user - δείξε PublicHomepage
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Hero Section */}
        <div className="text-center py-16 px-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            League of Legends
          </h1>
          <h2 className="text-4xl font-bold text-blue-300 mb-6">
            Rework Vault
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover reimagined champions with fresh abilities, updated lore, and exciting gameplay mechanics.
          </p>
          
          {/* Call to Action */}
          <div className="space-x-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Sign Up Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Login
            </Link>
          </div>
        </div>

        {/* Preview Champions - μόνο 3 unlocked */}
        <div className="px-8 pb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Preview Champions
          </h3>
          <p className="text-center text-gray-400 mb-8">
            Sign up to unlock all champions and their reworks!
          </p>
          
          <ChampionsList 
            showFilters={false}
            showTitle={false}
          />
          
          {/* Unlock More CTA */}
          <div className="text-center mt-12">
            <div className="bg-black/30 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">🔓</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Unlock All Champions
              </h4>
              <p className="text-gray-300 mb-4">
                Get access to all reworked champions and their abilities
              </p>
              <Link to="/register" className="btn btn-primary">
                Join Now - It's Free!
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Αν είναι logged user - δείξε full champions list
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* User Header */}
      <div className="bg-black/20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Champion Collection</h1>
            <p className="text-gray-300">Welcome back, {user?.name}!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">
              💰 {user?.points || 0} Points
            </div>
            <div className="text-sm text-gray-400">
              Available for unlocks
            </div>
          </div>
        </div>
      </div>

      {/* Champions List - με unlock system */}
      <ChampionsList 
        showFilters={true}
        showTitle={false}
      />
    </div>
  );
};

export default Champions;