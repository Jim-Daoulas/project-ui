import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useProgression } from '../hooks/useProgression';
import ChampionInfo from '../components/ChampionsInformation';
import ChampionAbilities from '../components/ChampionsAbility';
import SkinsGallery from '../components/SkinsGallery';
import { Champion } from '../types/champions';
import { BaseResponse } from '../types/helpers';
import ChampionRework from '../components/ChampionRework';

// Types based on your structure
interface ChampionResponse extends BaseResponse<Champion> {}

const ChampionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { trackChampionView } = useProgression();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get<ChampionResponse>(`/champions/${id}`);
        if (response.data.success) {
          setChampion(response.data.data);
          
          // Track champion view for points (only if user is logged in and champion is unlocked)
          if (user && response.data.data.is_unlocked) {
            trackChampionView(parseInt(id));
          }
        } else {
          setError('Failed to fetch champion details');
        }
      } catch (err) {
        setError('Error fetching champion details');
        console.error('Error fetching champion:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChampion();
  }, [id, user, trackChampionView]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !champion) {
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

  // Show locked content for locked champions
  if (user && !champion.is_unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-800 rounded-xl p-12 shadow-2xl">
              <div className="text-8xl mb-6">🔒</div>
              <h1 className="text-4xl font-bold text-white mb-4">{champion.name}</h1>
              <h2 className="text-xl text-gray-300 mb-6">{champion.title}</h2>
              
              <div className="bg-gray-700/50 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">Champion Locked</h3>
                <p className="text-gray-300 mb-4">
                  This champion is locked. Unlock it to view detailed information, abilities, skins, and rework proposals.
                </p>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-xl">
                    ⭐ 30 points required
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link to="/champions" className="btn btn-secondary">
                  ← Back to Champions
                </Link>
                <button 
                  onClick={() => window.history.back()}
                  className="btn btn-primary"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Main Content - All Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
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