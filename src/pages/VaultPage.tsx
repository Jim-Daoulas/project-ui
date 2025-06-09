// pages/VaultPage.tsx
import { Navigate } from 'react-router-dom';
import ChampionsList from '../components/ChampionsList';
import { useAuth } from '../context/AuthContext';

const VaultPage = () => {
  const { user, loading } = useAuth(); // ✅ Τώρα θα δουλέψει με το ενημερωμένο AuthContext

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-4 text-lg text-white">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* User Header */}
      <div className="bg-black/20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Champion Vault</h1>
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

      {/* Stats Section */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400">
              {user?.unlocked_champions_count || 0}
            </div>
            <div className="text-gray-300">Champions Unlocked</div>
          </div>
          <div className="bg-black/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {user?.unlocked_skins_count || 0}
            </div>
            <div className="text-gray-300">Skins Unlocked</div>
          </div>
          <div className="bg-black/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {((user?.unlocked_champions_count || 0) / 10 * 100).toFixed(0)}%
            </div>
            <div className="text-gray-300">Collection Complete</div>
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

export default VaultPage;