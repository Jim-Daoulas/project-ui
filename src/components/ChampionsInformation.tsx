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

    // Helper function to safely get stat values
    const getStat = (key: string): number => {
        if (!champion.stats || typeof champion.stats !== 'object') return 0;
        const value = champion.stats[key];
        return typeof value === 'number' ? value : parseInt(value) || 0;
    };

    // Stats configuration for the gaming-style display
    const mainStats = [
        {
            left: { key: 'hp', label: '❤️ HP', value: getStat('hp'), range: `${getStat('hp')} – ${Math.round(getStat('hp') * 1.8)}` },
            right: { key: 'mana', label: '💧 MP', value: getStat('mana'), range: `${getStat('mana')} – ${Math.round(getStat('mana') * 1.6)}` }
        },
        {
            left: { key: 'Health_Regen', label: '💚 HP5', value: getStat('Health_Regen'), range: `${getStat('Health_Regen')} – ${(getStat('Health_Regen') * 1.5).toFixed(1)}` },
            right: { key: 'Mana_regen', label: '💙 MP5', value: getStat('Mana_regen'), range: `${getStat('Mana_regen')} – ${(getStat('Mana_regen') * 2.1).toFixed(1)}` }
        },
        {
            left: { key: 'Armor', label: '🛡️ AR', value: getStat('Armor'), range: `${getStat('Armor')} – ${(getStat('Armor') + 70).toFixed(1)}` },
            right: { key: 'attack', label: '⚔️ AD', value: getStat('attack'), range: `${getStat('attack')} – ${Math.round(getStat('attack') + 45)}` }
        },
        {
            left: { key: 'Magic_Resistance', label: '🔮 MR', value: getStat('Magic_Resistance'), range: `${getStat('Magic_Resistance')} – ${(getStat('Magic_Resistance') + 20).toFixed(1)}` },
            right: { key: 'Critical_Damage', label: '💥 Crit. DMG', value: getStat('Critical_Damage'), range: `${getStat('Critical_Damage')}%` }
        },
        {
            left: { key: 'Move_Speed', label: '💨 MS', value: getStat('Move_Speed'), range: `${getStat('Move_Speed')}` },
            right: { key: 'Attack_Range', label: '🎯 Attack range', value: getStat('Attack_Range'), range: `${getStat('Attack_Range')}` }
        }
    ];

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

                    {/* Right Column - Gaming Style Stats */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-xl font-bold text-white">Base statistics</h3>
                            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-2 py-1 rounded text-xs font-bold">
                                Level: 1-18
                            </div>
                            <button className="ml-auto text-gray-400 hover:text-white text-sm">
                                Edit
                            </button>
                        </div>
                        
                        <div className="border border-yellow-600/40 overflow-hidden">
                            {mainStats.map((statPair, index) => (
                                <div key={index} className="border-b border-yellow-600/20 last:border-b-0">
                                    <div className="grid grid-cols-2">
                                        {/* Left Stat */}
                                        <div className="p-3 border-r border-yellow-600/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-medium text-sm">
                                                    {statPair.left.label}
                                                </span>
                                                <span className="text-yellow-300 font-bold">
                                                    {statPair.left.range}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Right Stat */}
                                        <div className="p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-medium text-sm">
                                                    {statPair.right.label}
                                                </span>
                                                <span className="text-purple-900 font-bold">
                                                    {statPair.right.range}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    );
};

export default ChampionInfo;