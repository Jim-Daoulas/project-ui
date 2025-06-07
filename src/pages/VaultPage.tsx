import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUnlock } from '../hooks/useUnlock';
import { Champion } from '../types/champions';
import { Skin } from '../types/skins';
import { AvailableUnlocks } from '../types/unlocks';
import { Link } from 'react-router-dom';
import UnlockButton from '../components/UnlockButton';

const VaultPage: React.FC = () => {
  const { user } = useAuth();
  const { userProgress, fetchAvailableUnlocks, addPoints } = useUnlock();
  const [availableUnlocks, setAvailableUnlocks] = useState<AvailableUnlocks | null>(null);
  const [activeTab, setActiveTab] = useState<'owned' | 'available'>('owned');
  const [loading, setLoading] = useState(false);

  // Fetch available unlocks
  useEffect(() => {
    if (user && activeTab === 'available') {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchAvailableUnlocks();
        setAvailableUnlocks(data);
        setLoading(false);
      };
      fetchData();
    }
  }, [user, activeTab]);

  // Handle add points for testing
  const handleAddPoints = async () => {
    await addPoints(50);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You need to login to access your vault</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏛️ Your Vault</h1>
          <p className="text-gray-300 mb-6">Manage your unlocked champions and skins</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">{userProgress?.points || 0}</div>
              <div className="text-sm text-gray-400">Available Points</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{userProgress?.unlocked_champions_count || 0}</div>
              <div className="text-sm text-gray-400">Champions Owned</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{userProgress?.unlocked_skins_count || 0}</div>
              <div className="text-sm text-gray-400">Skins Owned</div>
            </div>
          </div>

          {/* Add Points Button (για testing) */}
          <button 
            onClick={handleAddPoints}
            className="btn btn-outline btn-sm mt-4"
          >
            Add 50 Points (Testing)
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed bg-gray-800/50">
            <button 
              className={`tab ${activeTab === 'owned' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('owned')}
            >
              Owned Items
            </button>
            <button 
              className={`tab ${activeTab === 'available' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('available')}
            >
              Available to Unlock
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'owned' ? (
          <div className="space-y-8">
            {/* Owned Champions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Owned Champions</h2>
              {(!userProgress?.unlocked_champions_count || userProgress.unlocked_champions_count === 0) ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-gray-400">No champions unlocked yet</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                  <p className="text-gray-400">You own {userProgress.unlocked_champions_count} champions</p>
                  <Link to="/" className="btn btn-primary btn-sm mt-4">Browse All Champions</Link>
                </div>
              )}
            </div>

            {/* Owned Skins */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Owned Skins</h2>
              {(!userProgress?.unlocked_skins_count || userProgress.unlocked_skins_count === 0) ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-gray-400">No skins unlocked yet</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                  <p className="text-gray-400">You own {userProgress.unlocked_skins_count} skins</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Available Champions */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Champions You Can Unlock ({availableUnlocks?.available_champions.length || 0})
                  </h2>
                  {(!availableUnlocks?.available_champions || availableUnlocks.available_champions.length === 0) ? (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                      <div className="text-4xl mb-4">💰</div>
                      <p className="text-gray-400">No champions available with your current points</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableUnlocks.available_champions.map((champion: Champion) => (
                        <div key={champion.id} className="bg-gray-800/50 rounded-lg p-4">
                          <img 
                            src={champion.image_url || ''} 
                            alt={champion.name}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                          <h3 className="text-white font-bold mb-2">{champion.name}</h3>
                          <p className="text-gray-400 text-sm mb-4">{champion.title}</p>
                          <UnlockButton
                            type="champion"
                            id={champion.id}
                            name={champion.name}
                            cost={champion.unlock_cost}
                            isUnlockedByDefault={champion.is_unlocked_by_default}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Skins */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Skins You Can Unlock ({availableUnlocks?.available_skins.length || 0})
                  </h2>
                  {(!availableUnlocks?.available_skins || availableUnlocks.available_skins.length === 0) ? (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                      <div className="text-4xl mb-4">🎨</div>
                      <p className="text-gray-400">No skins available with your current points</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {availableUnlocks.available_skins.map((skin: Skin) => (
                        <div key={skin.id} className="bg-gray-800/50 rounded-lg p-3">
                          <img 
                            src={skin.image_url} 
                            alt={skin.name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                          <h4 className="text-white font-semibold text-sm mb-1">{skin.name}</h4>
                          <UnlockButton
                            type="skin"
                            id={skin.id}
                            name={skin.name}
                            cost={skin.unlock_cost}
                            isUnlockedByDefault={skin.is_unlocked_by_default}
                            className="w-full btn-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultPage;