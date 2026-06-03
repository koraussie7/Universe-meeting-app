import { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { useAppStore } from '../../shared/store/app';

interface FeedItem {
  id: string;
  content: string;
  plainText: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  media: Array<{ url: string; previewUrl: string; type: string }>;
  likes: number;
  replies: number;
  tags: string[];
}

const GRADIENTS = [
  'from-indigo-900 via-purple-900 to-pink-900',
  'from-cyan-900 via-blue-900 to-indigo-900',
  'from-rose-900 via-red-900 to-orange-900',
  'from-emerald-900 via-teal-900 to-cyan-900',
  'from-violet-900 via-fuchsia-900 to-purple-900',
];

// Mastodon feed — static JSON updated every 5 min by cron
const FEED_URL = '/feed.json';

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function mapStatus(s: any): FeedItem {
  return {
    id: s.id,
    content: s.content || '',
    plainText: stripHtml(s.content || ''),
    createdAt: s.created_at,
    author: {
      id: s.account?.id || '',
      username: s.account?.username || 'unknown',
      displayName: s.account?.display_name || s.account?.username || 'Unknown',
      avatar: s.account?.avatar || '',
    },
    media: (s.media || []).map((m: any) => ({
      url: m.url || '',
      previewUrl: m.preview_url || '',
      type: m.type || 'image',
    })),
    likes: s.likes || 0,
    replies: s.replies || 0,
    tags: (s.tags || []).map((t: any) => t.name),
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setShowOnboarding } = useAppStore();

  useEffect(() => {
    // Fetch static feed JSON (updated by cron every 5 min)
    // cache-bust to avoid stale browser/CDN cache
    fetch(`${FEED_URL}?_=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts.map(mapStatus));
        }
      })
      .catch(() => {
        console.log('Feed unavailable');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInteraction = () => setShowOnboarding(true);

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
          <p className="text-sm mt-1">Feed connecting to Mastodon...</p>
        </div>
      ) : (
        <div className="space-y-4 mt-2">
          {posts.map((post, i) => (
            <article key={post.id} className="border-b border-slate-800 pb-4">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 mb-3">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {post.author.username[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{post.author.displayName}</p>
                  <p className="text-xs text-slate-500">@{post.author.username}</p>
                </div>
                <span className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
                  Mastodon
                </span>
              </div>

              {/* Content */}
              <div className="px-4 mb-3">
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed line-clamp-6">
                  {post.plainText}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[11px] text-indigo-400">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media */}
              {post.media.length > 0 && (
                <div className="px-4 mb-3">
                  {post.media[0].type === 'image' ? (
                    <img
                      src={post.media[0].url}
                      alt=""
                      className="w-full rounded-xl object-cover max-h-96"
                      loading="lazy"
                    />
                  ) : post.media[0].type === 'video' || post.media[0].type === 'gifv' ? (
                    <video
                      src={post.media[0].url}
                      controls
                      className="w-full rounded-xl max-h-96"
                      preload="metadata"
                    />
                  ) : (
                    <div className={'aspect-video bg-gradient-to-br ' + (GRADIENTS[i % GRADIENTS.length]) + ' rounded-xl flex items-center justify-center'}>
                      <span className="text-4xl opacity-20">📎</span>
                    </div>
                  )}
                  {post.media.length > 1 && (
                    <p className="text-xs text-slate-500 mt-1">+{post.media.length - 1} more</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 mb-2">
                <button onClick={handleInteraction} className="flex items-center gap-1">
                  <FiHeart size={20} />
                  <span className="text-xs">{formatCount(post.likes)}</span>
                </button>
                <button onClick={handleInteraction} className="flex items-center gap-1">
                  <FiMessageCircle size={20} />
                  <span className="text-xs">{formatCount(post.replies)}</span>
                </button>
                <button className="ml-auto" onClick={handleInteraction}>
                  <FiBookmark size={20} />
                </button>
              </div>

              {/* Time */}
              <p className="px-4 text-[11px] text-slate-500 uppercase">
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
