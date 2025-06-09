import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ChampionInfo from '../components/ChampionsInformation';
import ChampionAbilities from '../components/ChampionsAbility';
import SkinsGallery from '../components/SkinsGallery';
import { Champion } from '../types/champions';
import { BaseResponse } from '../types/helpers';
import ChampionRework from '../components/ChampionRework';
import { Link, useParams } from 'react-router';

// Types based on your structure
interface ChampionResponse extends BaseResponse<Champion> {}

const ChampionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);

  useEffect(() => {
    const fetchChampion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get<ChampionResponse>(`/champions/${id}`);
        
        if (response.data.success) {
          setChampion(response.data.data);
          setIsLocked(false);
        } else {
          setError('Failed to fetch champion details');
        }
      } catch (err: any) {
        console.error('Error fetching champion:', err);
        
        // Check if it's a lock error
        if (err.response?.status === 403 && err.response?.data?.is_locked) {
          setIsLocked(true);
          setError('This champion is locked');
        } else {
          setError('Error fetching champion details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChampion();
  }, [id]);

  const handleUnlockChampion = async () => {
    if (!user) {
      alert('Please login to unlock champions');
      return;
    }

    if (!id) return;

    setUnlocking(true);
    
    try {
      const response = await axiosInstance.post(`/champions/${id}/unlock`);
      
      if (response.data.success) {
        // Refresh the champion data
        window.location.reload();
      } else {
        alert(response.data.message || 'Failed to unlock champion');
      }
    } catch (err: any) {
      console.error('Error unlocking champion:', err);
      alert(err.response?.data?.message || 'Failed to unlock champion');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 rounded-xl p-8 shadow-2xl">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-3xl font-bold text-white mb-4">Champion Locked</h1>
              <p className="text-gray-300 mb-8">
                This champion is currently locked. You need to unlock it to view its details.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleUnlockChampion}
                  disabled={!user || unlocking}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-300
                    ${!user 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-600 hover:bg-yellow-500 text-white hover:scale-105'
                    }
                    ${unlocking ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {unlocking ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Unlocking...
                    </span>
                  ) : !user ? (
                    'Login to Unlock'
                  ) : (
                    'Unlock Champion'
                  )}
                </button>
                
                <Link
                  to="/champions"
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Back to Champions
                </Link>
              </div>
              
              {!user && (
                <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <Link to="/login" className="underline hover:text-blue-200">
                      Login
                    </Link> or <Link to="/register" className="underline hover:text-blue-200">
                      Register
                    </Link> to unlock champions and access exclusive content!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>{error || 'Champion not found'}</span>
          </div>
          <Link to="/champions" className="btn btn-primary mt-4">
            Back to Champions
          </Link>
        </div>
      </div>
    );
  }

  if (!champion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>Champion not found</span>
          </div>
          <Link to="/champions" className="btn btn-primary mt-4">
            Back to Champions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Main Content - All Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Unlocked Banner */}
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-300">
              <span className="text-xl">🔓</span>
              <span className="font-medium">Champion Unlocked - You have full access to {champion.name}'s content!</span>
            </div>
          </div>
          
          {/* Champion Info Section */}
          <section>
            <ChampionInfo champion={champion} />
          </section>
          
          {/* Ability Section */}
          {champion.abilities && champion.abilities.length > 0 && (
            <section>
              <ChampionAbilities
                abilities={champion.abilities}
              />
            </section>
          )}
          
          {/* Skins Section */}
          {champion.skins && champion.skins.length > 0 && (
            <section>
              <SkinsGallery
                skins={champion.skins}
                championName={champion.name}
                showTitle={true}
              />
            </section>
          )}

          {/* Rework Section */}
          {champion.rework && (
            <section>
              <ChampionRework 
                champion={champion} 
                rework={champion.rework} 
              />
            </section>
          )}
        </div>
      </div>
      
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-30"
      >
        ↑
      </button>
    </div>
  );
};

export default ChampionDetail;