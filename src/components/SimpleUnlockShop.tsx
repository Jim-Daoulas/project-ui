// src/components/SimpleUnlockShop.tsx
import React, { useState } from 'react';
import { UnlockableChampion, UnlockableSkin } from '../types/progression';
import { useProgression } from '../hooks/useProgression';

interface SimpleUnlockShopProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleUnlockShop = ({ isOpen, onClose }: SimpleUnlockShopProps) => {
  const { progress, availableUnlocks, unlockChampion, unlockSkin, loading } = useProgression();
  const [activeTab, setActiveTab] = useState<'champions' | 'skins'>('champions');
  const [unlocking, setUnlocking] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleUnlockChampion = async (champion: UnlockableChampion) => {
    if (!champion.can_afford || unlocking) return;
    
    setUnlocking(champion.id);
    const success = await unlockChampion(champion.id);
    
    if (success) {
      console.log(`${champion.name} unlocked!`);
    }
    
    setUnlocking(null);
  };

  const handleUnlockSkin = async (skin: UnlockableSkin) => {
    if (!skin.can_afford || unlocking) return;
    
    setUnlocking(skin.id);
    const success = await unlockSkin(skin.id);
    
    if (success) {
      console.log(`${skin.name} unlocked!`);
    }
    
    setUnlocking(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Unlock Shop</h2>
            <p className="text-gray-400">Spend your points to unlock new content</p>
          </div>
          <div className="flex items-center gap-4">
            {progress && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <span className="text-blue-400">⭐</span>
                <span className="text-white font-bold">{progress.total_points}</span>
                <span className="text-gray-400 text-sm">points</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="text-gray-400 text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('champions')}
            className={`
              flex-1 py-4 px-6 font-medium transition-colors
              ${activeTab === 'champions'
                ? 'text-white border-b-2 border-purple-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>⚔️</span>
              <span>Champions (30 pts)</span>
              {availableUnlocks && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {availableUnlocks.champions.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('skins')}
            className={`
              flex-1 py-4 px-6 font-medium transition-colors
              ${activeTab === 'skins'
                ? 'text-white border-b-2 border-purple-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🎨</span>
              <span>Skins (10 pts)</span>
              {availableUnlocks && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {availableUnlocks.skins.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading unlockables...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'champions' && (
                <div>
                  {!availableUnlocks?.champions.length ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-xl font-semibold text-white mb-2">All Champions Unlocked!</h3>
                      <p className="text-gray-400">You've unlocked all available champions.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableUnlocks.champions.map((champion) => (
                        <ChampionCard
                          key={champion.id}
                          champion={champion}
                          onUnlock={handleUnlockChampion}
                          isUnlocking={unlocking === champion.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skins' && (
                <div>
                  {!availableUnlocks?.skins.length ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-xl font-semibold text-white mb-2">All Skins Unlocked!</h3>
                      <p className="text-gray-400">You've unlocked all available skins for your champions.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableUnlocks.skins.map((skin) => (
                        <SkinCard
                          key={skin.id}
                          skin={skin}
                          onUnlock={handleUnlockSkin}
                          isUnlocking={unlocking === skin.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Champion Card Component
interface ChampionCardProps {
  champion: UnlockableChampion;
  onUnlock: (champion: UnlockableChampion) => void;
  isUnlocking: boolean;
}

const ChampionCard = ({ champion, onUnlock, isUnlocking }: ChampionCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
      <div className="aspect-[4/3] relative">
        <img
          src={champion.image_url || '/placeholder-champion.jpg'}
          alt={champion.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-champion.jpg';
          }}
        />
        <div className="absolute bottom-2 left-2">
          <h4 className="text-white font-bold">{champion.name}</h4>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⭐</span>
            <span className={`font-bold ${champion.can_afford ? 'text-white' : 'text-red-400'}`}>
              {champion.cost}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onUnlock(champion)}
          disabled={!champion.can_afford || isUnlocking}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
            ${champion.can_afford
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
            ${isUnlocking ? 'animate-pulse' : ''}
          `}
        >
          {isUnlocking ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Unlocking...</span>
            </div>
          ) : !champion.can_afford ? (
            'Not enough points'
          ) : (
            'Unlock Champion'
          )}
        </button>
      </div>
    </div>
  );
};

// Skin Card Component
interface SkinCardProps {
  skin: UnlockableSkin;
  onUnlock: (skin: UnlockableSkin) => void;
  isUnlocking: boolean;
}

const SkinCard = ({ skin, onUnlock, isUnlocking }: SkinCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
      <div className="aspect-[4/3] relative">
        <img
          src={skin.image_url || '/placeholder-skin.jpg'}
          alt={skin.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-skin.jpg';
          }}
        />
        <div className="absolute bottom-2 left-2">
          <h4 className="text-white font-bold text-sm">{skin.name}</h4>
          <p className="text-gray-300 text-xs">{skin.champion_name}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⭐</span>
            <span className={`font-bold ${skin.can_afford ? 'text-white' : 'text-red-400'}`}>
              {skin.cost}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onUnlock(skin)}
          disabled={!skin.can_afford || isUnlocking}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 text-sm
            ${skin.can_afford
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
            ${isUnlocking ? 'animate-pulse' : ''}
          `}
        >
          {isUnlocking ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Unlocking...</span>
            </div>
          ) : !skin.can_afford ? (
            'Not enough points'
          ) : (
            'Unlock Skin'
          )}
        </button>
      </div>
    </div>
  );
};

export default SimpleUnlockShop;