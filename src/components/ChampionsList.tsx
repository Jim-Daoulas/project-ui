import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Champion, ChampionsResponse } from '../types/champions';

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

  // Helper function για fallback images
  const getChampionImage = (champion: Champion): string => {
    // Πρώτα δοκιμάστε το avatar_url από Spatie Media
    if (champion.avatar_url) {
      return champion.avatar_url;
    }
    
    // Μετά το image_url
    if (champion.image_url) {
      if (champion.image_url.startsWith('http')) {
        return champion.image_url;
      }
      return `${axiosInstance.defaults.baseURL}/storage/${champion.image_url}`;
    }
    
    // Fallback
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.name}_0.jpg`;
  };

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
          // Fallback if data is directly an array
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
  }, []);

  // Filter champions based on search and filters
  const filteredChampions = (champions || []).filter(champion => {
    if (!champion) return false;
    
    const matchesSearch = (champion.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (champion.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || champion.role === selectedRole;
    const matchesRegion = selectedRegion === 'all' || champion.region === selectedRegion;
    
    return matchesSearch && matchesRole && matchesRegion;
  }).slice(0, limit); // Apply limit if provided

  // Get unique roles and regions for filters
  const roles = [...new Set((champions || []).map(champion => champion?.role).filter(Boolean))];
  const regions = [...new Set((champions || []).map(champion => champion?.region).filter(Boolean))];

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
            <Link
              key={champion.id}
              to={`/champions/${champion.id}`}
              className="champion-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-[3/4] group"
            >
              {/* Background Image with improved error handling */}
              <img
                src={getChampionImage(champion)}
                alt={champion.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // First fallback: try Riot CDN
                  if (!target.src.includes('ddragon.leagueoflegends.com')) {
                    target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.name}_0.jpg`;
                  } else {
                    // Second fallback: placeholder with champion initial
                    target.src = `https://via.placeholder.com/400x500/667eea/ffffff?text=${champion.name.charAt(0)}`;
                  }
                }}
                loading="lazy"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Champion Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-1">
                  {champion.name}
                </h2>
                <p className="text-gray-300 text-sm truncate">
                  {champion.title}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {champion.role}
                  </span>
                  <span className="text-xs text-gray-300">
                    {champion.region}
                  </span>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChampionsList;