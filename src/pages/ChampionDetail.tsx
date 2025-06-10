import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ChampionInfo from '../components/ChampionsInformation';
import ChampionAbilities from '../components/ChampionsAbility';
import SkinsGallery from '../components/SkinsGallery';
import UnlockChampion from '../components/UnlockChampion';
import { Champion } from '../types/champions';
import { BaseResponse } from '../types/helpers';
import ChampionRework from '../components/ChampionRework';

// Types based on your structure
interface ChampionResponse extends BaseResponse<Champion> {}

const ChampionDetail = () => {
  const { id } = useParams<{ id: string }>();
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
  }, [id]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Check if champion is locked */}
          {champion.is_locked ? (
            <section>
              <UnlockChampion 
                champion={champion} 
                onUnlock={() => window.location.reload()} 
              />
            </section>
          ) : (
            <>
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
            </>
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