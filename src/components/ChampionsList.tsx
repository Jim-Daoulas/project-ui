import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUnlock } from '../hooks/useUnlock';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Champion } from '../types/champions';

// ✅ Define the correct API response type
interface ChampionsApiResponse {
  success: boolean;
  data: Champion[];
  message: string;
}

// ✅ ADD: Props interface for ChampionsList
interface ChampionsListProps {
  showFilters?: boolean;
  showTitle?: boolean;
}

const ChampionsList: React.FC<ChampionsListProps> = ({ 
  showFilters = true, 
  showTitle = true 
}) => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { userProgress, unlockChampion } = useUnlock();

  // ✅ Fetch champions based on auth status
  const fetchChampions = async () => {
    try {
      setLoading(true);
      
      // Use different endpoint based on auth status
      const endpoint = user ? '/champions/champions' : '/champions/public';
      const response = await axiosInstance.get<ChampionsApiResponse>(endpoint);
      
      console.log('API Response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setChampions(response.data.data);
        console.log('Champions loaded:', response.data.data.map(c => c.id));
        console.log('Champions with lock status:', response.data.data.map(c => ({ id: c.id, locked: c.is_locked })));
      } else {
        console.error('Invalid API response structure:', response.data);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching champions:', error);
      setError('Failed to load champions');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle unlock champion
  const handleUnlockChampion = async (championId: number) => {
    if (!user) {
      alert('Please login to unlock champions');
      return;
    }

    try {
      const result = await unlockChampion(championId);
      
      if (result.success) {
        await fetchChampions();
        alert(result.message || 'Champion unlocked successfully!');
      } else {
        alert(result.message || 'Failed to unlock champion');
      }
    } catch (error) {
      console.error('Error unlocking champion:', error);
      alert('An error occurred while unlocking the champion');
    }
  };

  useEffect(() => {
    fetchChampions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading champions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ✅ Conditional title */}
      {showTitle && (
        <h1 className="text-4xl font-bold text-center mb-8">Champions</h1>
      )}
      
      {/* User info for authenticated users */}
      {user && userProgress && (
        <div className="bg-blue-100 p-4 rounded-lg mb-6 text-center">
          <p className="text-lg">
            Welcome, <strong>{user.name}</strong>! 
            You have <strong>{userProgress.points}</strong> points.
          </p>
        </div>
      )}

      {/* ✅ Conditional filters */}
      {showFilters && (
        <div className="mb-6 text-center">
          <div className="text-gray-400">
            {/* Add filter controls here if needed */}
            Showing all champions
          </div>
        </div>
      )}

      {/* Champions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {champions.map((champion) => (
          <div key={champion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Champion image */}
            <div className="relative">
              <img
                src={champion.image_url || '/placeholder-champion.jpg'}
                alt={champion.name}
                className={`w-full h-48 object-cover ${
                  champion.is_locked ? 'filter grayscale opacity-50' : ''
                }`}
              />
              
              {/* Lock overlay */}
              {champion.is_locked && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="text-sm">Locked</div>
                  </div>
                </div>
              )}
            </div>

            {/* Champion info */}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{champion.name}</h3>
              <p className="text-gray-600 mb-2">{champion.title}</p>
              <p className="text-sm text-gray-500 mb-4">{champion.role}</p>

              {/* Action buttons */}
              <div className="flex gap-2">
                {champion.is_locked ? (
                  <>
                    {user ? (
                      <button
                        onClick={() => handleUnlockChampion(champion.id)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
                        disabled={!userProgress || userProgress.points < (champion.unlock_cost || 0)}
                      >
                        Unlock ({champion.unlock_cost || 0} points)
                      </button>
                    ) : (
                      <div className="flex-1 bg-gray-400 text-white px-4 py-2 rounded text-center">
                        Login to Unlock
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={`/champions/${champion.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {champions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No champions found.</p>
        </div>
      )}
    </div>
  );
};

export default ChampionsList;