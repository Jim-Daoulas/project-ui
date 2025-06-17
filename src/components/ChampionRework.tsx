import { useState } from 'react';
import { Champion } from '../types/champions';
import { Rework } from '../types/reworks';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

interface ChampionReworkProps {
    champion: Champion;
    rework?: Rework | null;
}

const ChampionRework = ({ champion, rework }: ChampionReworkProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState(rework?.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');

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

    // Submit comment function
    const handleSubmitComment = async () => {
        if (!newComment.trim()) {
            setCommentError('Please enter a comment');
            return;
        }

        if (!user) {
            setCommentError('You must be logged in to comment');
            return;
        }

        if (!rework) {
            setCommentError('No rework available to comment on');
            return;
        }

        try {
            setIsSubmittingComment(true);
            setCommentError('');

            const response = await axiosInstance.post(`/champions/${champion.id}/rework/comments`, {
                content: newComment.trim()
            });

            if (response.data.success) {
                // Add the new comment to the list
                const newCommentData = {
                    id: Date.now(), // Temporary ID
                    rework_id: rework.id,
                    user_id: user.id,
                    content: newComment.trim(),
                    created_at: new Date().toISOString(),
                    user: { 
                        id: user.id,
                        name: user.name 
                    }
                };

                setComments(prev => [...prev, newCommentData]);
                setNewComment('');
            }
        } catch (error: any) {
            console.error('Error submitting comment:', error);
            setCommentError(error.response?.data?.message || 'Failed to submit comment');
        } finally {
            setIsSubmittingComment(false);
        }
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
                    Champion Rework
                </h2>
                <p className="text-gray-300">
                    Proposed changes and improvements for {champion.name}
                </p>
            </div>

            {/* Rework Content */}
            <div className="p-6 space-y-6">
                {/* Rework Info */}
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

                {/* Rework Stats */}
                {rework.stats && (
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Stats</h4>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                            <div className="text-gray-300 whitespace-pre-line">
                                {typeof rework.stats === 'string' ? rework.stats : JSON.stringify(rework.stats, null, 2)}
                            </div>
                        </div>
                    </div>
                )}

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
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        Community Feedback
                        <span className="text-sm text-gray-400">({comments.length})</span>
                    </h4>
                    
                    {/* Add Comment Form */}
                    {user ? (
                        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts on this rework proposal..."
                                        className="w-full bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows={3}
                                        maxLength={500}
                                    />
                                    {commentError && (
                                        <div className="text-red-400 text-sm mt-2">{commentError}</div>
                                    )}
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-gray-400 text-sm">
                                            {newComment.length}/500 characters
                                        </span>
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={isSubmittingComment || !newComment.trim()}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                        >
                                            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-center">
                            <p className="text-gray-400 mb-3">You must be logged in to comment on rework proposals.</p>
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                Login to Comment
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    {comments.length > 0 ? (
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-800/30 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-gray-300 font-medium">
                                            {comment.user?.name || `User #${comment.user_id}`}
                                        </span>
                                        {comment.created_at && (
                                            <span className="text-gray-500 text-xs">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChampionRework;