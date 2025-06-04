import { Champion } from '../types/champions';

interface ChampionInfoProps {
    champion: Champion;
}

const ChampionInfo = ({ champion }: ChampionInfoProps) => {
    
    if (!champion) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="relative p-6 bg-gradient-to-r from-gray-800 to-gray-700">
                <div className="flex items-start gap-6">
                    {/* Champion Portrait */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-purple-500/50 shadow-lg">
                            <img
                                src={champion.image_url || '/placeholder-champion.jpg'}
                                alt={champion.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-champion.jpg';
                                }}
                            />
                        </div>
                    </div>

                    {/* Champion Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {champion.name}
                        </h1>
                        <h2 className="text-lg text-gray-300 mb-3 italic">
                            {champion.title}
                        </h2>
                        
                        {/* Role and Region */}
                        <div className="flex gap-4 mb-4">
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium">
                                {champion.role}
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm font-medium">
                                {champion.region}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - Grid Layout */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column - Champion Lore */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            Champion Lore
                        </h3>
                        <div className="bg-gray-800/50 rounded-lg p-4 h-fit">
                            <p className="text-gray-300 leading-relaxed">
                                {champion.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Stats Table */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            Base Statistics
                        </h3>
                        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-700/50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Statistic
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Visual
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {champion.stats ? (
                                        <>
                                            <tr className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <span className="text-lg">❤️</span>
                                                    <span className="text-white font-medium">Health Points</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-red-400 font-bold text-lg">{champion.stats.hp || 0}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((champion.stats.hp || 0) / 150) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <span className="text-lg">💙</span>
                                                    <span className="text-white font-medium">Mana Points</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-blue-400 font-bold text-lg">{champion.stats.mana || 0}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((champion.stats.mana || 0) / 150) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <span className="text-lg">⚔️</span>
                                                    <span className="text-white font-medium">Attack Damage</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-400 font-bold text-lg">{champion.stats.attack || 0}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((champion.stats.attack || 0) / 100) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <span className="text-lg">🛡️</span>
                                                    <span className="text-white font-medium">Defense</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-green-400 font-bold text-lg">{champion.stats.defense || 0}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((champion.stats.defense || 0) / 100) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <span className="text-lg">🔮</span>
                                                    <span className="text-white font-medium">Ability Power</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-purple-400 font-bold text-lg">{champion.stats.ability_power || 0}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((champion.stats.ability_power || 0) / 100) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* Additional Stats if they exist */}
                                            {Object.entries(champion.stats)
                                                .filter(([key]) => !['hp', 'mana', 'attack', 'defense', 'ability_power'].includes(key))
                                                .map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-gray-700/30 transition-colors">
                                                        <td className="px-4 py-3 flex items-center gap-2">
                                                            <span className="text-lg">📈</span>
                                                            <span className="text-white font-medium capitalize">
                                                                {key.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="text-indigo-400 font-bold text-lg">{value || 0}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="w-full bg-gray-600 rounded-full h-2">
                                                                <div 
                                                                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${Math.min(((value || 0) / 100) * 100, 100)}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                                                No stats available for this champion
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    );
};

export default ChampionInfo;