import { useState } from 'react';
import { Ability } from '../types/abilities';

interface AbilitiesProps {
    abilities: Ability[];
    championName?: string;
}

const ChampionAbilities = ({ abilities, championName }: AbilitiesProps) => {
    // State για να κρατάμε ποιο ability είναι επιλεγμένο
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(
        abilities?.[0] || null
    );

    // Έλεγχος αν δεν υπάρχουν abilities
    if (!abilities || abilities.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">
                    {championName ? `${championName} Abilities` : 'Champion Abilities'}
                </h2>
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-400">No abilities data available</p>
                </div>
            </div>
        );
    }

    // Ταξινόμηση των abilities με σωστή σειρά
    const sortedAbilities = [...abilities].sort((a, b) => {
        const order = ['Passive', 'Q', 'W', 'E', 'R'];
        return order.indexOf(a.key.toUpperCase()) - order.indexOf(b.key.toUpperCase());
    });

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                     Champion Abilities
                </h2>
                <p className="text-gray-300">
                    {championName ? `${championName}'s` : 'Champion'} skill set and abilities
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-700 relative h-30">
                <div className="flex overflow-x-auto">
                    {sortedAbilities.map((ability) => (
                        <button
                            key={ability.id}
                            onClick={() => setSelectedAbility(ability)}
                            className={`
                                flex-shrink-0 relative group px-4 py-4 font-medium transition-all duration-300
                                ${selectedAbility?.id === ability.id
                                    ? 'border-b-2 border-white bg-gray-800/50 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center gap-2">
                                {/* Ability Icon */}
                                <div className={`
                                    w-12 h-12 rounded-lg overflow-hidden
                                    bg-gradient-to-br
                                    shadow-md flex items-center justify-center relative
                                    ${selectedAbility?.id === ability.id ? 'shadow-lg scale-110' : ''}
                                    transition-all duration-300
                                `}>
                                    {ability.image_url ? (
                                        <img
                                            src={ability.image_url}
                                            alt={ability.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-sm text-white">
                                           
                                        </span>
                                    )}
                                    
                                </div>
                                
                                {/* Ability Name */}
                                <div className="text-center">
                                    <div className="text-xs font-medium">
                                        {ability.name}
                                    </div>
                                </div>
                            </div>

                            {/* Active Tab Indicator */}
                            {selectedAbility?.id === ability.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {selectedAbility && (
                    <div className="space-y-6">
                        {/* Ability Header */}
                        <div className="flex items-start gap-6">
                            {/* Large Ability Icon */}
                            <div className={`
                                flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden
                                bg-gradient-to-br}
                                shadow-xl flex items-center justify-center relative
                            `}>
                                {selectedAbility.image_url ? (
                                    <img
                                        src={selectedAbility.image_url}
                                        alt={selectedAbility.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="text-4xl text-white">
                                        {selectedAbility.key}
                                    </span>
                                )}
                                
                            </div>

                            {/* Ability Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {selectedAbility.name}
                                </h3>
                                <div className={`
                                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                                    bg-gradient-to-r text-white
                                    shadow-lg
                                `}>
                                    <span className="text-lg">
                                        {selectedAbility.key}
                                    </span>                                   
                                </div>
                            </div>
                        </div>

                        {/* Ability Description */}
                        <div className="bg-gray-800/50 rounded-lg p-6">
                            <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                Description
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {selectedAbility.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChampionAbilities;