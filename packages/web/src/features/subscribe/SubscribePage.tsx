import { FiPlay } from 'react-icons/fi';

const channels = [
  { name: 'DADA Dev', subs: '128K', avatar: '', latestVideo: 'Building Universe: Week 1 Recap', thumbnail: 'https://picsum.photos/seed/ch1/320/180' },
  { name: 'Minima Core', subs: '95K', avatar: '', latestVideo: 'Minima 1.4 Release Notes', thumbnail: 'https://picsum.photos/seed/ch2/320/180' },
  { name: 'AAGAG News', subs: '42K', avatar: '', latestVideo: 'Myanmar Daily Report June 2026', thumbnail: 'https://picsum.photos/seed/ch3/320/180' },
  { name: 'Cloudflare TV', subs: '210K', avatar: '', latestVideo: 'IPFS Gateway Deep Dive', thumbnail: 'https://picsum.photos/seed/ch4/320/180' },
  { name: 'Universe Lab', subs: '15K', avatar: '', latestVideo: 'P2P Media Loader Integration', thumbnail: 'https://picsum.photos/seed/ch5/320/180' },
  { name: 'Caddy Server', subs: '88K', avatar: '', latestVideo: 'Reverse Proxy Best Practices 2026', thumbnail: 'https://picsum.photos/seed/ch6/320/180' },
];

const subVideos = Array.from({ length: 10 }, (_, i) => ({
  id: `sub${i}`,
  title: [
    'SwarmCloud ServiceWorker Explained',
    'NestJS Microservices Architecture',
    'Mastodon 4.6 Migration Guide',
    'DTube Archive: 28K Posts Analysis',
    'Building P2P Video Player from Scratch',
    'Cloudflare Workers for Video Streaming',
    'PostgreSQL Performance Tuning',
    'WebRTC Data Channels in Production',
    'Docker Compose for Mastodon Stack',
    'Caddy vs Nginx: 2026 Comparison',
  ][i],
  author: channels[i % channels.length].name,
  views: `${(Math.random() * 300 + 1).toFixed(0)}K`,
  timeAgo: `${Math.floor(Math.random() * 14 + 1)} days ago`,
  duration: `${Math.floor(Math.random() * 40 + 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  thumbnail: `https://picsum.photos/seed/subv${i}/640/360`,
}));

export default function SubscriptionsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Channel list */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-3 scrollbar-hide">
        {channels.map((ch) => (
          <button key={ch.name} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 ring-2 ring-red-500 ring-offset-2 ring-offset-[#0f0f0f] flex items-center justify-center text-white text-lg font-bold">
              {ch.name[0]}
            </div>
            <span className="text-white text-xs max-w-[72px] truncate">{ch.name}</span>
          </button>
        ))}
        <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-gray-400 text-xs">Browse</span>
        </button>
      </div>

      {/* Today's videos */}
      <h2 className="text-white text-lg font-bold mb-3">Today</h2>
      <div className="space-y-4">
        {subVideos.map((video) => (
          <div key={video.id} className="flex gap-3 cursor-pointer group">
            <div className="relative w-44 aspect-video rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{video.duration}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-gray-300">{video.title}</h3>
              <p className="text-gray-400 text-xs mb-1">{video.author}</p>
              <p className="text-gray-400 text-xs">{video.views} views · {video.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
