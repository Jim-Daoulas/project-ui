import { useState, useRef } from 'react';
import { Skin } from '../types/skins';
import UnlockButton from './UnlockButton';

interface SkinsGalleryProps {
    skins: Skin[];
    championName?: string;
    showTitle?: boolean;
}

const SkinsGallery = ({ skins, championName, showTitle = true }: SkinsGalleryProps) => {
    const [selectedSkin, setSelectedSkin] = useState<Skin>(skins?.[0] || null);
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    const handleSkinUnlock = () => {
        console.log('Skin unlocked successfully!');
        // Re-fetch skins or update state as needed
    };

    const handleSkinSelect = (skin: Skin) => {
        setSelectedSkin(skin);
        
        const skinIndex = skins.findIndex(s => s.id === skin.id);
        
        if (thumbnailsRef.current && skinIndex !== -1) {
            const container = thumbnailsRef.current;
            const thumbnailWidth = 96 + 12;
            const containerWidth = container.clientWidth;
            const scrollPosition = skinIndex * thumbnailWidth;
            
            let targetScroll = scrollPosition - (containerWidth / 2) + (thumbnailWidth / 2);
            const maxScroll = container.scrollWidth - containerWidth;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
            
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    const goToPreviousSkin = () => {
        const currentIndex = skins.findIndex(s => s.id === selectedSkin?.id);
        if (currentIndex > 0) {
            handleSkinSelect(skins[currentIndex - 1]);
        } else {
            handleSkinSelect(skins[skins.length - 1]);
        }
    };

    const goToNextSkin = () => {
        const currentIndex = skins.findIndex(s => s.id === selectedSkin?.id);
        if (currentIndex < skins.length - 1) {
            handleSkinSelect(skins[currentIndex + 1]);
        } else {
            handleSkinSelect(skins[0]);
        }
    };

    if (!skins || skins.length === 0) {
        return (
            <div className="w-full">
                {showTitle && (
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        {championName ? `${championName} Skins` : 'Champion Skins'}
                    </h2>
                )}
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-gray-400">No skins available for this champion</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {showTitle && (
                <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider">
                    Available Skins
                </h2>
            )}
            
            {/* Main Display Image */}
            <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
                <div className="aspect-[16/9] relative">
                    {selectedSkin ? (
                        <>
                            <img
                                src={selectedSkin.image_url}
                                alt={selectedSkin.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-skin.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-white text-2xl font-bold mb-2">
                                    {selectedSkin.name}
                                </h3>
                            </div>

                            {/* ✅ Unlock Button - διορθωμένο */}
                            {selectedSkin.is_locked && (
                                <div className="absolute bottom-6 right-6">
                                    <UnlockButton 
                                        type="skin"
                                        id={selectedSkin.id}
                                        name={selectedSkin.name}
                                        cost={selectedSkin.unlock_cost}
                                        isUnlockedByDefault={selectedSkin.is_unlocked_by_default}
                                        isUnlocked={!selectedSkin.is_locked}  // ✅ Αντίστροφη λογική
                                        canUnlock={true}  // ✅ Hardcoded για τώρα
                                        onSuccess={handleSkinUnlock}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎨</div>
                                <p className="text-gray-400">Select a skin to preview</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnails Row */}
            <div 
                ref={thumbnailsRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {skins.map((skin) => (
                    <div
                        key={skin.id}
                        className={`
                            relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer
                            transition-all duration-300 hover:scale-105
                            ${selectedSkin?.id === skin.id 
                                ? 'ring-2 ring-purple-400 ring-opacity-100 shadow-lg shadow-purple-400/50' 
                                : 'ring-1 ring-gray-600 hover:ring-gray-400'
                            }
                        `}
                        onClick={() => handleSkinSelect(skin)}
                    >
                        <img
                            src={skin.image_url}
                            alt={skin.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-skin-thumb.jpg';
                            }}
                        />
                        
                        {selectedSkin?.id === skin.id && (
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-purple-400 rounded-full border-2 border-white" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end">
                            <div className="p-1 w-full">
                                <p className="text-white text-xs font-medium truncate">
                                    {skin.name}
                                </p>
                            </div>
                        </div>

                        {/* ✅ Lock indicator - διορθωμένο */}
                        {skin.is_locked && (
                            <div className="absolute top-1 right-1">
                                <div className="w-5 h-5 bg-gray-900/80 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">🔒</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            {skins.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button 
                        onClick={goToPreviousSkin}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                        title="Previous skin"
                    >
                        ←
                    </button>
                    <span className="flex items-center px-4 text-gray-400 text-sm">
                        {skins.findIndex(s => s.id === selectedSkin?.id) + 1} / {skins.length}
                    </span>
                    <button 
                        onClick={goToNextSkin}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                        title="Next skin"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkinsGallery;