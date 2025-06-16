import { useState, useRef, useEffect } from 'react';
import { Skin } from '../types/skins';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router';

interface SkinsGalleryProps {
    skins: Skin[];
    championName?: string;
    showTitle?: boolean;
    onSkinUnlocked?: () => void; // Callback για refresh
}

const SkinsGallery = ({ skins, championName, showTitle = true, onSkinUnlocked }: SkinsGalleryProps) => {
    const { user, updateUserPoints } = useAuth();
    const [selectedSkin, setSelectedSkin] = useState<Skin>(skins?.[0] || null);
    const [unlockingStates, setUnlockingStates] = useState<Record<number, boolean>>({});
    const [userPoints, setUserPoints] = useState<number>(0);
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const [skinsLoading] = useState(false);

    useEffect(() => {
        if (skins && skins.length > 0 && !selectedSkin) {
            setSelectedSkin(skins[0]);
        }
    }, [skins, selectedSkin]);
    
    // Fetch user points on component mount
    useEffect(() => {
        if (user) {
            axiosInstance.get('/unlocks/progress')
                .then(response => {
                    if (response.data.success) {
                        setUserPoints(response.data.data.points);
                    }
                })
                .catch(error => console.error('Failed to fetch user progress:', error));
        }
    }, [user]);

    // ✅ ΔΙΟΡΘΩΣΗ: Συνάρτηση για unlock skin
    const handleUnlockSkin = async (skin: Skin) => {
        if (!user) {
            alert('Please login to unlock skins');
            return;
        }

        setUnlockingStates(prev => ({ ...prev, [skin.id]: true }));

        try {
            // ✅ ΔΙΟΡΘΩΣΗ: Σωστό endpoint
            const response = await axiosInstance.post(`/skins/${skin.id}/unlock`);
            
            if (response.data.success) {
                alert(`${skin.name} unlocked successfully!`);
                
                const newPoints = response.data.data.user_points; // Από το backend response
                updateUserPoints(newPoints);
                setUserPoints(newPoints);
                
                // Call the callback to refresh parent component
                if (onSkinUnlocked) {
                    onSkinUnlocked();
                }
            } else {
                alert(response.data.message || 'Failed to unlock skin');
            }
        } catch (error: any) {
            console.error('Unlock error:', error);
            const message = error.response?.data?.message || 'Failed to unlock skin';
            alert(message);
        } finally {
            setUnlockingStates(prev => ({ ...prev, [skin.id]: false }));
        }
    };

    // Συνάρτηση για αλλαγή skin με αυτόματο scroll
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

    if (!skins || skins.length === 0) {
        return (
            <div className="w-full">
                {showTitle && (
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        {championName ? `${championName} Skins` : 'Champion Skins'}
                    </h2>
                )}
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No skins available for this champion</p>
                </div>
            </div>
        );
    }

    return (
       <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {showTitle && (
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        Champion Skins
                    </h3>
                    {skinsLoading ? (
                        <div className="text-center">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : null}
                </div>
            )}
            
            {/* Main Display Image */}
            <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
                <div className="aspect-[16/9] relative">
                    {selectedSkin ? (
                        <>
                            {/* Locked Overlay */}
                            {selectedSkin.is_locked && (
                                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-gray-300 mb-4">
                                            Unlock cost: {selectedSkin.unlock_cost} points
                                        </p>
                                        {user ? (
                                            <button
                                                onClick={() => handleUnlockSkin(selectedSkin)}
                                                disabled={
                                                    unlockingStates[selectedSkin.id] || 
                                                    userPoints < selectedSkin.unlock_cost
                                                }
                                                className={`
                                                    px-6 py-2 rounded-lg font-semibold transition-colors
                                                    ${userPoints >= selectedSkin.unlock_cost
                                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                {unlockingStates[selectedSkin.id] 
                                                    ? 'Unlocking...' 
                                                    : userPoints >= selectedSkin.unlock_cost
                                                        ? 'Unlock Skin'
                                                        : 'Not Enough Points'
                                                }
                                            </button>
                                        ) : (
                                            <Link to="/login"
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                            >
                                                Login to Unlock
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            <img
                                src={selectedSkin.image_url}
                                alt={selectedSkin.name}
                                className={`w-full h-full object-cover ${selectedSkin.is_locked ? 'filter grayscale' : ''}`}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-skin.jpg';
                                }}
                            />
                            
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {/* Skin Name Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
                                            {selectedSkin.name}
                                            {selectedSkin.is_locked && <span className="text-yellow-400">🔒</span>}
                                        </h3>
                                        {selectedSkin.is_locked && (
                                            <p className="text-yellow-400 text-sm">
                                                {selectedSkin.unlock_cost} points to unlock
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
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
                            className={`w-full h-full object-cover ${skin.is_locked ? 'filter grayscale' : ''}`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-skin-thumb.jpg';
                            }}
                        />
                        
                        {/* Locked overlay for thumbnails */}
                        {skin.is_locked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-yellow-400 text-sm">🔒</span>
                            </div>
                        )}
                        
                        {/* Selected indicator */}
                        {selectedSkin?.id === skin.id && (
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-purple-400 rounded-full border-2 border-white" />
                            </div>
                        )}
                        
                        {/* Hover overlay with skin name and unlock cost */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end">
                            <div className="p-1 w-full">
                                <p className="text-white text-xs font-medium truncate">
                                    {skin.name}
                                </p>
                                {skin.is_locked && (
                                    <p className="text-yellow-400 text-xs">
                                        {skin.unlock_cost}💰
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation arrows για manual scrolling */}
            {skins.length > 5 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button 
                        onClick={() => {
                            if (thumbnailsRef.current) {
                                thumbnailsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                            }
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                    >
                        ←
                    </button>
                    <button 
                        onClick={() => {
                            if (thumbnailsRef.current) {
                                thumbnailsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                            }
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                    >
                        →
                    </button>
                </div>
            )}

            {/* Unlock Summary */}
            {user && (
                <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">
                            Unlocked: {skins.filter(s => !s.is_locked).length} / {skins.length} skins
                        </span>
                        <span className="text-gray-400">
                            Total unlock cost: {skins.filter(s => s.is_locked).reduce((sum, s) => sum + s.unlock_cost, 0)} points
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkinsGallery;