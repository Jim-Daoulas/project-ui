import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Champion, ChampionsResponse } from '../types/champions';
import { useAuth } from '../context/AuthContext';
import UnlockButton from './UnlockButton';

interface ChampionsListProps {
  showFilters?: boolean;
  showTitle?: boolean;
  limit?: number;
  guestMode?: boolean;  // ✅ Νέο prop
}

const ChampionsList = ({ 
  showFilters = true, 
  showTitle = true, 
  limit,
  guestMode = false  // ✅ Default false
}: ChampionsListProps) => {
  const { user } = useAuth();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const endpoint = guestMode ? '/champions/public' : '/champions/champions';

  // Fetch champions from API
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get<ChampionsResponse>('/champions/champions');
        console.log('API Response:', response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          setChampions(response.data.data);
          console.log('Champions loaded:', response.data.data);
        } else if (Array.isArray(response.data)) {
          setChampions(response.data);
          console.log('Champions loaded (fallback):', response.data);
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
  }).slice(0, limit);

  // Get unique roles and regions for filters
  const roles = [...new Set((champions || []).map(champion => champion?.role).filter(Boolean))];
  const regions = [...new Set((champions || []).map(champion => champion?.region).filter(Boolean))];

  // Handler για refresh μετά από unlock
  const handleUnlockSuccess = () => {
    const fetchChampions = async () => {
      try {
        const response = await axiosInstance.get<ChampionsResponse>('/champions/champions');
        if (response.data.success && Array.isArray(response.data.data)) {
          setChampions(response.data.data);
        }
      } catch (err) {
        console.error('Error refreshing champions:', err);
      }
    };
    fetchChampions();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-4 text-lg">Loading champions...</span>
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
      {/* Title */}
      {showTitle && (
        <div className="mb-8 pt-8 px-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">League of Legends Rework Vault</h1>
          <p className="text-lg text-gray-500">
            Explore all League of Legends champions and their rework proposals
          </p>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="mb-8 px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500">Search Champions</span>
            </label>
            <input
              type="text"
              placeholder="Search by name or title..."
              className="input input-bordered w-full text-gray-600 border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Filter by Role</span>
            </label>
            <select
              className="select select-bordered w-full text-gray-500 border-gray-600"
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
              <span className="label-text text-white">Filter by Region</span>
            </label>
            <select
              className="select select-bordered w-full text-gray-500 border-gray-600"
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

      {/* Results Count */}
      <div className="mb-6 px-8 text-sm text-gray-400">
        Showing {filteredChampions.length} of {champions.length} champions
      </div>

      {/* Champions Grid */}
      {filteredChampions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-white">No champions found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="px-8 pb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredChampions.map(champion => (
            <div
              key={champion.id}
              className="champion-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-[3/4] group"
            >
              {/* ✅ ΔΙΟΡΘΩΣΗ: Χρήση user_has_unlocked αντί για is_unlocked */}
              {!champion.user_has_unlocked && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <div className="text-white text-center px-4">
                    <p className="text-sm font-semibold mb-2">Locked Champion</p>
                    <p className="text-xs mb-3 opacity-75">Cost: {champion.unlock_cost} points</p>
                    <UnlockButton
                      type="champion"
                      id={champion.id}
                      name={champion.name}
                      cost={champion.unlock_cost}
                      canUnlock={champion.user_can_unlock}  // ✅ canUnlock αντί για userCanUnlock
                      className="btn-sm"
                      onSuccess={handleUnlockSuccess}
                    />
                  </div>
                </div>
              )}

              {/* Background Image */}
              <img
                src={champion.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'}
                alt={champion.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${!champion.user_has_unlocked ? 'grayscale blur-sm' : ''
                  }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x500/667eea/ffff?text=${champion.name.charAt(0)}`;
                }}
              />

              {/* ✅ ΔΙΟΡΘΩΣΗ: Link μόνο αν είναι unlocked */}
              {champion.user_has_unlocked && (
                <Link
                  to={`/champions/${champion.id}`}
                  className="absolute inset-0 z-5"
                />
              )}

              {/* Bottom bar with champion name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 p-3 z-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg uppercase tracking-wide">
                    {champion.name}
                  </h2>
                  {champion.is_unlocked_by_default && (
                    <div className="badge badge-success badge-sm">Free</div>
                  )}
                  {champion.user_has_unlocked && !champion.is_unlocked_by_default && (
                    <div className="badge badge-primary badge-sm">Owned</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChampionsList;