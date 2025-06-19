// pages/Champions.tsx
import ChampionsList from '../components/ChampionsList';
import { useAuth } from '../context/AuthContext';

const Champions = () => {
  const { user } = useAuth();

  // Αν είναι guest user - δείξε PublicHomepage
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Hero Section */}
        <div className="text-center py-16 px-8">
          <h1 className="text-3xl font-bold text-white">Champion Collection</h1>
        </div>

        {/* Preview Champions - μόνο 3 unlocked */}
        <div className="pb-16">         
          <ChampionsList 
            showFilters={true}
          />
        </div>
      </div>
    );
  }

  // ✅ Αν είναι logged user - δείξε full champions list
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
          <div className="text-center py-16 px-8">
            <h1 className="text-3xl font-bold text-white">Champion Collection</h1>
          </div>

      {/* Champions List - με unlock system */}
      <div className="pb-8">
        <ChampionsList 
          showFilters={true}
        />
      </div>
    </div>
  );
};

export default Champions;