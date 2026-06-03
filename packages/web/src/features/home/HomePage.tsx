import { FiPlay, FiClock, FiThumbsUp, FiMoreHorizontal } from 'react-icons/fi';

interface VideoCard {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  views: string;
  timeAgo: string;
  duration: string;
}

// Mock data
const chips = ['All', 'Music', 'Gaming', 'Live', 'Mixes', 'DADA Coin', 'Blockchain', 'Minima', 'AI', 'Podcasts'];

const videos: VideoCard[] = Array.from({ length: 12 }, (_, i) => ({
  id: `v${i}`,
  title: [
    'Building a Decentralized Video Platform with Minima',
    'DADA Coin Rewards: How P2P Content Sharing Works',
    'Live Coding: SwarmCloud WebRTC Integration',
    'AAGAG News: Myanmar Business Report',
    'Installing Minima Node on Ubuntu Server',
    'Clappr.js vs Video.js: Player Migration Guide',
    'Cloudflare IPFS Gateway Setup Tutorial',
    'DTube to Universe Migration Walkthrough',
    'Building with p2p-media-loader and HLS.js',
    'Mastodon Federation: Setting Up Your Instance',
    'NestJS API for Decentralized Media Storage',
    'Caddy Reverse Proxy Deep Dive',
  ][i % 12],
  author: ['DADA Dev', 'Universe Lab', 'Minima Core', 'AAGAG Bot', 'Cloudflare TV'][i % 5],
  authorAvatar: '',
  thumbnail: `https://picsum.photos/seed/video${i}/640/360`,
  views: `${(Math.random() * 500 + 1).toFixed(0)}K`,
  timeAgo: `${Math.floor(Math.random() * 30 + 1)} days ago`,
  duration: `${Math.floor(Math.random() * 30 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
}));

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Chip filters */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f] border-b border-white/5 pb-2 pt-3">
        <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
          {chips.map((chip) => (
            <button
              key={chip}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors
                ${chip === 'All' 
                  ? 'bg-white text-black font-medium' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: VideoCard }) {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.duration}
        </span>
        {/* Hover play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <FiPlay size={40} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
          {video.author[0]}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-medium line-clamp-2 leading-5 mb-1">
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
            {video.author}
          </p>
          <p className="text-gray-400 text-xs">
            {video.views} views · {video.timeAgo}
          </p>
        </div>

        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all">
          <FiMoreHorizontal size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
