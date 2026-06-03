import { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';

interface Post {
  id: number;
  caption: string | null;
  type: string;
  mediaUrl: string | null;
  author: { id: number; username: string; avatar: string | null; name: string | null };
  _count: { likes: number; comments: number };
  createdAt: string;
}

const GRADIENTS = [
  'from-indigo-900 via-purple-900 to-pink-900',
  'from-cyan-900 via-blue-900 to-indigo-900',
  'from-rose-900 via-red-900 to-orange-900',
  'from-emerald-900 via-teal-900 to-cyan-900',
  'from-violet-900 via-fuchsia-900 to-purple-900',
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/feed?take=20')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleLike = async (postId: number) => {
    try {
      await fetch('/api/v1/feed/' + postId + '/like', { method: 'POST' });
    } catch { /* JWT required in prod */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* Stories bar */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-800">
        {['Your Story', 'cosmic', 'nebula', 'void', 'quantum', 'astro', 'pixel'].map((name, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={'w-16 h-16 rounded-full p-0.5 ' + (i === 0 ? 'bg-slate-700' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600')}>
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xl">
                {i === 0 ? '➕' : ['🌟','💫','🌙','⚡','🪐','🎯'][i-1]}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 truncate w-16 text-center">
              {i === 0 ? 'You' : name}
            </span>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-medium">No posts yet</p>
          <p className="text-sm mt-1">Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4 mt-2">
          {posts.map((post, i) => (
            <article key={post.id} className="border-b border-slate-800 pb-4">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                  {post.author.avatar || post.author.username[0].toUpperCase()}
                </div>
                <span className="font-semibold text-sm flex-1">{post.author.username}</span>
                <span className="text-[10px] text-slate-500">{post.type.toUpperCase()}</span>
                <button>
                  <FiMoreHorizontal size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Media placeholder */}
              <div className={'aspect-square bg-gradient-to-br ' + (GRADIENTS[i % GRADIENTS.length]) + ' flex items-center justify-center mb-3'}>
                <span className="text-6xl opacity-20">{post.type === 'reel' ? '🎬' : '📷'}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 mb-2">
                <button onClick={() => toggleLike(post.id)}>
                  <FiHeart size={24} />
                </button>
                <button>
                  <FiMessageCircle size={24} />
                </button>
                <button className="ml-auto">
                  <FiBookmark size={24} />
                </button>
              </div>

              {/* Likes */}
              <p className="px-4 font-semibold text-sm mb-1">
                {formatCount(post._count.likes)} likes
              </p>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 text-sm">
                  <span className="font-semibold mr-1">{post.author.username}</span>
                  {post.caption}
                </div>
              )}

              {/* Comments link */}
              {post._count.comments > 0 && (
                <p className="px-4 text-sm text-slate-400 mt-1">
                  View all {post._count.comments} comments
                </p>
              )}

              {/* Time */}
              <p className="px-4 text-[11px] text-slate-500 mt-1 uppercase">
                {timeAgo(post.createdAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  return Math.floor(hours / 24) + 'd ago';
}
