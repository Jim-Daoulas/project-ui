import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUnlock } from '../hooks/useUnlock';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Champion } from '../types/champions';

// ✅ API Response type
interface ChampionsApiResponse {
  success: boolean;
  data: Champion[];
  message: string;
}

interface ChampionsListProps {
  showFilters?: boolean;
  showTitle?: boolean;
  limit?: number;
}

const ChampionsList = ({ 
  showFilters = true, 
  limit 
}: ChampionsListProps) => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  const { user, updateUserPoints } = useAuth();
  const { userProgress } = useUnlock();

  // ✅ Fetch champions with unlock functionality
  const fetchChampions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use different endpoint based on auth status
      const endpoint = user ? '/champions/champions' : '/champions/public';
      const response = await axiosInstance.get<ChampionsApiResponse>(endpoint);
      
      console.log('API Response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setChampions(response.data.data);
        console.log('Champions loaded:', response.data.data);
        console.log('Detailed champions:', response.data.data.map(c => ({
          id: c.id,
          name: c.name,
          is_locked: c.is_locked
        })));
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Failed to fetch champions - unexpected data format');
      }
    } catch (err) {
      setError('Error fetching champions');
      console.error('Error fetching champions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle unlock champion
  const handleUnlockChampion = async (championId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const champion = champions.find(c => c.id === championId);
    if (!champion) return;

    // Σιωπηλή έξοδος αν δεν είναι logged in ή δεν έχει userProgress
    if (!user || !userProgress) {
      return; 
    }

    try {
      const response = await axiosInstance.post(`/unlocks/unlock/champion/${champion.id}`);
      
      if (response.data.success) {
        // Ενημέρωσε το AuthContext με τους νέους πόντους
        updateUserPoints(response.data.data.user_points);
        
        await fetchChampions(); // Re-fetch to update UI
        alert(`${champion.name} unlocked successfully!`);
      } else {
        alert(response.data.message || 'Failed to unlock champion');
      }
    } catch (error: any) {
      console.error('Error unlocking champion:', error);
      const message = error.response?.data?.message || 'Failed to unlock champion';
      alert(message);
    }
  };

  useEffect(() => {
    fetchChampions();
  }, [user]);

  // Filter champions based on search and filters
  const filteredChampions = (champions || []).filter(champion => {
    if (!champion) return false;
    
    const matchesSearch = (champion.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (champion.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || champion.role === selectedRole;
    const matchesRegion = selectedRegion === 'all' || champion.region === selectedRegion;
    
    return matchesSearch && matchesRole && matchesRegion;
  })
  .sort((a, b) => {
    // Αλφαβητική ταξινόμηση βάσει ονόματος
    return a.name.localeCompare(b.name);
  }).slice(0, limit);

  // Get unique roles and regions for filters
  const roles = [...new Set((champions || []).map(champion => champion?.role).filter(Boolean))];
  const regions = [...new Set((champions || []).map(champion => champion?.region).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-white"></span>
        <span className="ml-4 text-lg text-white">Loading champions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Filters */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Search Champions</span>
            </label>
            <input
              type="text"
              placeholder="Search by name or title..."
              className="input input-bordered w-full text-gray-800 bg-white/90"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Filter by Role</span>
            </label>
            <select
              className="select select-bordered w-full text-gray-800 bg-white/90"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Filter by Region</span>
            </label>
            <select
              className="select select-bordered w-full text-gray-800 bg-white/90"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Champions Grid */}
      {filteredChampions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-white">No champions found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-8 pb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredChampions.map(champion => (
            champion.is_locked ? (
              <div
                key={champion.id}
                className="champion-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-[3/4] group cursor-pointer"
                onClick={(e) => handleUnlockChampion(champion.id, e)}
              >
                {/* Background Image */}
                <img
                  src={champion.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'}
                  alt={champion.name}
                  className="absolute inset-0 w-full h-full object-cover filter grayscale"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x500/667eea/ffff?text=${champion.name.charAt(0)}`;
                  }}
                />
                
                {/* Lock overlay με λογική όπως SkinsGallery */}
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <div className="text-white text-center">
                    {user && userProgress ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnlockChampion(champion.id, e);
                        }}
                        disabled={
                          (userProgress.points || 0) < (champion.unlock_cost || 0)
                        }
                        className={`
                          px-3 py-2 rounded text-xs font-semibold transition-colors
                          ${(userProgress.points || 0) >= (champion.unlock_cost || 0)
                            ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {(userProgress.points || 0) >= (champion.unlock_cost || 0)
                          ? `Unlock (${champion.unlock_cost || 0} points)`
                          : 'Not Enough Points'
                        }
                      </button>
                    ) : (
                      <Link to="/login"
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-semibold text-white">
                        Login to Unlock
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Bottom bar with champion name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 p-3">
                  <h2 className="text-white font-bold text-sm sm:text-lg uppercase tracking-wide">
                    {champion.name}
                  </h2>
                </div>
              </div>
            ) : (
              <Link
                key={champion.id}
                to={`/champions/${champion.id}`}
                className="champion-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-[3/4] group"
              >
                {/* Background Image */}
                <img
                  src={champion.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'}
                  alt={champion.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x500/667eea/ffff?text=${champion.name.charAt(0)}`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 p-2 sm:p-3">
                  <h2 className="text-white font-bold text-sm sm:text-lg uppercase tracking-wide">
                    {champion.name}
                  </h2>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">View Details</p>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ChampionsList;