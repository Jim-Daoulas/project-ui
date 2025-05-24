import { Champion } from "../types/champions";
import { Link } from 'react-router-dom';

type Props = {
    champions: Champion[];
};

function ChampionsList({ champions }: Props) {
    return (

        <div className="champions-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">League of Legends Rework Vault</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {champions.map(champion => (
          <Link 
            to={`/champions/${champion.id}`} 
            key={champion.id}
            className="champion-card bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-98 overflow-hidden">
              <img 
                src={champion.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'} 
                alt={champion.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">{champion.name}</h2>
              <p className="text-gray-300 italic mb-2">{champion.title}</p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">{champion.role}</span>
                <span className="text-amber-400">{champion.region}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    );
}

export default ChampionsList;