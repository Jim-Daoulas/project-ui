import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ChampionInfo from '../components/ChampionsInformation';
import ChampionAbilities from '../components/ChampionsAbility';
import SkinsGallery from '../components/SkinsGallery';
import { Champion } from '../types/champions';
import { Skin } from '../types/skins';
import { BaseResponse } from '../types/helpers';
import ChampionRework from '../components/ChampionRework';
import { useAuth } from '../context/AuthContext';

interface ChampionResponse extends BaseResponse<Champion> {}
interface SkinsResponse extends BaseResponse<Skin[]> {}

const ChampionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [skinsLoading, setSkinsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChampion = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // ✅ Χρησιμοποιούμε το σωστό endpoint ανάλογα με authentication
      const endpoint = user ? `/champions/${id}` : `/champions/public/${id}`;
      const response = await axiosInstance.get<ChampionResponse>(endpoint);
      
      if (response.data.success) {
        setChampion(response.data.data);
      } else {
        setError('Failed to fetch champion details');
      }
    } catch (err: any) {
      console.error('Error fetching champion:', err);
      
      // ✅ Καλύτερο error handling
      if (err.response?.status === 404) {
        setError('Champion not found');
      } else if (err.response?.status === 403) {
        setError('This champion is locked. Please unlock it first.');
      } else {
        setError('Error fetching champion details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSkins = async () => {
    if (!id) return;
    
    try {
      setSkinsLoading(true);
      
      // ✅ Χρησιμοποιούμε το σωστό endpoint για skins
      const endpoint = user 
        ? `/skins/champion/${id}` 
        : `/skins/public/champion/${id}`;
      
      const response = await axiosInstance.get<SkinsResponse>(endpoint);
      
      if (response.data.success) {
        setSkins(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching skins:', err);
      // Δεν κάνουμε error για skins, απλά δεν τα δείχνουμε
      setSkins([]);
    } finally {
      setSkinsLoading(false);
    }
  };

  useEffect(() => {
    fetchChampion();
    fetchSkins();
  }, [id, user]); // ✅ Προσθέσαμε user dependency

  // ✅ Callback function για refresh όταν unlock skin
  const handleSkinUnlocked = () => {
    fetchSkins(); // Re-fetch μόνο τα skins
  };

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
          
          {/* ✅ Skins Section - χρησιμοποιούμε τα skins από το state */}
          <section>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🎨 Champion Skins
                </h3>
                
                {skinsLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : skins.length > 0 ? (
                  <SkinsGallery
                    skins={skins}
                    championName={champion.name}
                    showTitle={false}
                    onSkinUnlocked={handleSkinUnlocked}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No skins available for this champion
                  </div>
                )}
              </div>
            </div>
          </section>

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