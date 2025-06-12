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

    // Helper function to safely get stat values and handle ranges
    const getStat = (key: string): { value: number, range: string } => {
        if (!champion.stats || typeof champion.stats !== 'object') return { value: 0, range: '0' };
        
        const rawValue = champion.stats[key];
        if (!rawValue) return { value: 0, range: '0' };
        
        // Convert to string to handle both numbers and strings
        const stringValue = String(rawValue);
        
        // If it contains a dash or range, return as is
        if (stringValue.includes('–') || stringValue.includes('-')) {
            // Extract first number for calculations
            const firstNumber = parseInt(stringValue.split(/[–-]/)[0].trim()) || 0;
            return { value: firstNumber, range: stringValue };
        }
        
        // If it's a single number
        const numValue = parseInt(stringValue) || 0;
        return { value: numValue, range: stringValue };
    };

    // Stats configuration for the gaming-style display
    const mainStats = [
        {
            left: { key: 'hp', label: '❤️ HP', ...getStat('hp') },
            right: { key: 'mp', label: '💧 MP', ...getStat('mp') }
        },
        {
            left: { key: 'Health_Regen', label: '💚 HP5', ...getStat('Health_Regen') },
            right: { key: 'Mana_regen', label: '💙 MP5', ...getStat('Mana_regen') }
        },
        {
            left: { key: 'Armor', label: '🛡️ AR', ...getStat('Armor') },
            right: { key: 'Attack', label: '⚔️ AD', ...getStat('Attack') }
        },
        {
            left: { key: 'Magic_Resistance', label: '🔮 MR', ...getStat('Magic_Resistance') },
            right: { key: 'Critical_Damage', label: '💥 Crit. DMG', ...getStat('Critical_Damage') }
        },
        {
            left: { key: 'Move_Speed', label: '💨 MS', ...getStat('Move_Speed') },
            right: { key: 'Attack_Range', label: '🎯 Attack range', ...getStat('Attack_Range') }
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
                                                <span className="text-yellow-300 font-bold">
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