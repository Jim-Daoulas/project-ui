import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Champion, Comment, ApiResponse } from '../types/models';

function ChampionDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch champion details
    axios.get(`/champions/${id}`)
      .then(response => {
        console.log('Champion data:', response.data);
        if (response.data && response.data.data) {
          setChampion(response.data.data);
        } else {
          setError('Invalid data format from API');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching champion:', error);
        setError('Failed to load champion details');
        setLoading(false);
      });
      
    // If user is logged in, also fetch comments
    if (user) {
      fetchComments();
    }
  }, [id, user]);
  
  const fetchComments = () => {
    axios.get(`/champions/${id}/rework/comments`)
      .then(response => {
        console.log('Comments data:', response.data);
        if (response.data && response.data.data) {
          setComments(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  };
  
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    axios.post(`/champions/${id}/rework/comments`, { content: newComment })
      .then(response => {
        console.log('Comment added:', response.data);
        setNewComment('');
        fetchComments(); // Refresh comments
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };
  
  if (loading) return <div className="loading">Loading champion details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!champion) return <div className="error">Champion not found</div>;
  
  return (
    <div className="champion-detail-container max-w-6xl mx-auto px-4 py-8">
      {/* Champion Header */}
      <div className="bg-[url({champion.image_url}] champion-header mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="champion-image w-full md:w-1/3">
          <img 
            src={champion.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'} 
            alt={champion.name}
            className="w-full rounded-lg shadow-xl"
          />
        </div>
        
        <div className="champion-info w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{champion.name}</h1>
          <h2 className="text-xl text-gray-600 italic mb-4">{champion.title}</h2>
          
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{champion.role}</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{champion.region}</span>
          </div>
          
          <p className="text-lg mb-6">{champion.description}</p>
          
          {/* Champion Stats */}
          <div className="stats-container grid grid-cols-2 md:grid-cols-3 gap-4">
            {champion.stats && Object.entries(champion.stats).map(([key, value]) => (
              <div key={key} className="stat-item bg-gray-100 p-3 rounded-lg">
                <div className="stat-name text-sm text-gray-600">{key}</div>
                <div className="stat-value font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Current Abilities */}
      <section className="current-abilities mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Current Abilities</h2>
        
        <div className="abilities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {champion.abilities && champion.abilities.map(ability => (
            <div key={ability.id} className="ability-card bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="ability-icon bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {ability.key}
                </div>
                <h3 className="ability-name text-xl font-semibold">{ability.name}</h3>
              </div>
              <p className="ability-description text-gray-700">{ability.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Skins Section */}
      <section className="skins-section mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Skins</h2>
        
        <div className="skins-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {champion.skins && champion.skins.map(skin => (
            <div key={skin.id} className="skin-card overflow-hidden rounded-lg shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src={skin.image_url || 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg'} 
                  alt={skin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-xl font-semibold">{skin.name}</h3>
                {skin.description && <p className="text-gray-600">{skin.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Rework Section */}
      {champion.rework && (
        <section className="rework-section mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 border-b border-indigo-200 pb-2">Proposed Rework</h2>
          
          <div className="rework-info mb-8">
            <h3 className="text-2xl font-semibold mb-3">{champion.rework.title}</h3>
            <p className="text-lg mb-6">{champion.rework.summary}</p>
            
            {/* Reworked Stats */}
            {champion.rework.stats && (
              <div className="stats-container mb-8">
                <h4 className="text-xl font-semibold mb-3">Updated Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(champion.rework.stats).map(([key, value]) => (
                    <div key={key} className="stat-item bg-white p-3 rounded-lg shadow">
                      <div className="stat-name text-sm text-gray-600">{key}</div>
                      <div className="stat-value font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reworked Abilities */}
            {champion.rework.abilities && champion.rework.abilities.length > 0 && (
              <div className="reworked-abilities">
                <h4 className="text-xl font-semibold mb-3">Updated Abilities</h4>
                <div className="abilities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {champion.rework.abilities.map(ability => (
                    <div key={ability.id} className="ability-card bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="ability-icon bg-indigo-100 text-indigo-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                          {ability.key}
                        </div>
                        <h3 className="ability-name text-xl font-semibold">{ability.name}</h3>
                      </div>
                      <p className="ability-description text-gray-700">{ability.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div className="comments-section mt-12 bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-4">Community Feedback</h3>
            
            {user ? (
              <>
                <div className="comments-list mb-6">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="comment p-4 border-b">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                  )}
                </div>
                
                <form onSubmit={handleAddComment} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this rework..."
                    className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-indigo-200 focus:outline-none"
                    rows="3"
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add Comment
                  </button>
                </form>
              </>
            ) : (
              <div className="login-prompt text-center py-6">
                <p className="text-gray-600 mb-3">Please log in to view and add comments.</p>
                <a href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Log In
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ChampionDetail;