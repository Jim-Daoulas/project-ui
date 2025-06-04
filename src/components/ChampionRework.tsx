import { useState } from 'react';
import { Champion } from '../types/champions';
import { Rework } from '../types/reworks';

interface ChampionReworkProps {
    champion: Champion;
    rework?: Rework | null;
}
const ChampionRework = ({ champion, rework }: ChampionReworkProps) =>
 {
    const [activeView, setActiveView] = useState<'current' | 'rework'>('current');

    // Helper για τα χρώματα των stats
    const getStatColor = (currentValue: number, reworkValue: number) => {
        if (reworkValue > currentValue) return 'text-green-400';
        if (reworkValue < currentValue) return 'text-red-400';
        return 'text-gray-300';
    };

    // Helper για τα χρώματα των ability keys
    const getAbilityKeyColor = (key: string) => {
        const colors = {
            'PASSIVE': 'from-yellow-500 to-yellow-600',
            'Q': 'from-green-500 to-green-600',
            'W': 'from-blue-500 to-blue-600',
            'E': 'from-purple-500 to-purple-600',
            'R': 'from-red-500 to-red-600',
        };
        return colors[key.toUpperCase() as keyof typeof colors] || 'from-gray-500 to-gray-600';
    };

    // Safe stat access helper
    const getStat = (stats: Record<string, any> | null | undefined, key: string): number => {
        if (!stats || typeof stats !== 'object') return 0;
        const value = stats[key];
        return typeof value === 'number' ? value : 0;
    };

    // Render stats comparison
    const renderStatsComparison = () => {
        if (!rework?.stats || !champion.stats) return null;

        const statLabels = {
            hp: 'Health Points',
            mana: 'Mana Points',
            attack: 'Attack Damage',
            defense: 'Defense',
            ability_power: 'Ability Power'
        };

        return (
            <div className="space-y-4">
                {Object.entries(statLabels).map(([key, label]) => {
                    const currentValue = getStat(champion.stats, key);
                    const reworkValue = getStat(rework.stats, key);
                    const difference = reworkValue - currentValue;
                    
                    return (
                        <div key={key} className="bg-gray-800/30 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-medium">{label}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 text-sm">
                                        Current: <span className="text-white">{currentValue}</span>
                                    </span>
                                    <span className="text-gray-400 text-sm">→</span>
                                    <span className="text-gray-400 text-sm">
                                        Rework: <span className={getStatColor(currentValue, reworkValue)}>{reworkValue}</span>
                                    </span>
                                    {difference !== 0 && (
                                        <span className={`text-sm font-bold ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ({difference > 0 ? '+' : ''}{difference})
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Visual bar comparison */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Current</div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((currentValue / 200) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Rework</div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                difference > 0 ? 'bg-green-400' : difference < 0 ? 'bg-red-400' : 'bg-gray-400'
                                            }`}
                                            style={{ width: `${Math.min((reworkValue / 200) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!rework) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        🔄 Champion Rework
                    </h2>
                    <p className="text-gray-300">
                        Proposed changes and improvements for {champion.name}
                    </p>
                </div>
                
                <div className="p-6">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔧</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Rework Available</h3>
                        <p className="text-gray-400 mb-6">
                            This champion doesn't have a rework proposal yet.
                        </p>
                        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                            Suggest a Rework
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    🔄 Champion Rework
                </h2>
                <p className="text-gray-300">
                    Proposed changes and improvements for {champion.name}
                </p>
            </div>

            {/* Toggle View */}
            <div className="border-b border-gray-700">
                <div className="flex">
                    <button
                        onClick={() => setActiveView('current')}
                        className={`
                            flex-1 px-6 py-4 font-medium transition-all duration-300
                            ${activeView === 'current'
                                ? 'bg-gray-800/50 text-white border-b-2 border-blue-400'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                            }
                        `}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">📊</span>
                            <span>Current State</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('rework')}
                        className={`
                            flex-1 px-6 py-4 font-medium transition-all duration-300
                            ${activeView === 'rework'
                                ? 'bg-gray-800/50 text-white border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                            }
                        `}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">🔄</span>
                            <span>Rework Proposal</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeView === 'current' ? (
                    /* Current State View */
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">Current Champion State</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {champion.description}
                            </p>
                        </div>

                        {/* Current Stats */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Current Statistics</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { label: 'HP', value: getStat(champion.stats, 'hp'), icon: '❤️', color: 'text-red-400' },
                                    { label: 'Mana', value: getStat(champion.stats, 'mana'), icon: '💙', color: 'text-blue-400' },
                                    { label: 'Attack', value: getStat(champion.stats, 'attack'), icon: '⚔️', color: 'text-orange-400' },
                                    { label: 'Defense', value: getStat(champion.stats, 'defense'), icon: '🛡️', color: 'text-green-400' },
                                    { label: 'AP', value: getStat(champion.stats, 'ability_power'), icon: '🔮', color: 'text-purple-400' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                                        <div className="text-2xl mb-1">{stat.icon}</div>
                                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                                        <div className="text-xs text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Abilities */}
                        {champion.abilities && champion.abilities.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Current Abilities</h4>
                                <div className="space-y-3">
                                    {champion.abilities.map((ability) => (
                                        <div key={ability.id} className="bg-gray-800/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`
                                                    w-10 h-10 rounded-lg
                                                    bg-gradient-to-br ${getAbilityKeyColor(ability.key)}
                                                    flex items-center justify-center text-white font-bold text-sm
                                                `}>
                                                    {ability.key.toUpperCase()}
                                                </div>
                                                <h5 className="text-white font-semibold">{ability.name}</h5>
                                            </div>
                                            <p className="text-gray-300 text-sm">{ability.description}</p>
                                            {ability.image_url && (
                                                <div className="mt-3">
                                                    <img 
                                                        src={ability.image_url} 
                                                        alt={ability.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Rework Proposal View */
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{rework.title}</h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                {rework.summary}
                            </p>
                            <div className="text-sm text-gray-400">
                                Proposed by: <span className="text-white">Admin User</span>
                                {rework.created_at && (
                                    <span className="ml-4">
                                        Created: {new Date(rework.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats Comparison */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Statistics Changes</h4>
                            {renderStatsComparison()}
                        </div>

                        {/* Reworked Abilities */}
                        {rework.abilities && rework.abilities.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Reworked Abilities</h4>
                                <div className="space-y-3">
                                    {rework.abilities.map((ability) => (
                                        <div key={ability.id} className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-purple-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`
                                                    w-10 h-10 rounded-lg
                                                    bg-gradient-to-br ${getAbilityKeyColor(ability.key)}
                                                    flex items-center justify-center text-white font-bold text-sm
                                                `}>
                                                    {ability.key.toUpperCase()}
                                                </div>
                                                <h5 className="text-white font-semibold">{ability.name}</h5>
                                                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">REWORKED</span>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-3">{ability.description}</p>
                                            
                                            {/* Ability Image */}
                                            {ability.image_url && (
                                                <div className="mb-3">
                                                    <img 
                                                        src={ability.image_url} 
                                                        alt={ability.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Ability Details */}
                                            {ability.details && typeof ability.details === 'object' && (
                                                <div className="mt-3 p-3 bg-gray-700/30 rounded">
                                                    <h6 className="text-white text-xs font-semibold mb-2">Details:</h6>
                                                    <div className="text-gray-300 text-xs space-y-1">
                                                        {Object.entries(ability.details).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                <span>{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        {rework.comments && rework.comments.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Community Feedback</h4>
                                <div className="space-y-3">
                                    {rework.comments.map((comment) => (
                                        <div key={comment.id} className="bg-gray-800/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    U
                                                </div>
                                                <span className="text-gray-400 text-sm">
                                                    User #{comment.user_id}
                                                </span>
                                                {comment.created_at && (
                                                    <span className="text-gray-500 text-xs">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-300 text-sm">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChampionRework;