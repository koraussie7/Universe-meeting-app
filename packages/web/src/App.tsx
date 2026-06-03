import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-indigo-400">🌌 Universe Meeting</h1>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<div>🎥 Live (coming soon)</div>} />
          <Route path="/feed" element={<div>📱 Feed (coming soon)</div>} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
      <h2 className="text-4xl font-bold">
        Open Source <span className="text-indigo-400">Communication Hub</span>
      </h2>
      <p className="text-slate-400 text-lg">
        Real-time meetings · Social feed · Short videos · Creator subscriptions · Self-hosted
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/live" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium">
          Start Meeting
        </a>
        <a href="/feed" className="border border-slate-600 hover:border-slate-400 px-6 py-3 rounded-lg font-medium">
          Browse Feed
        </a>
      </div>
    </div>
  );
}
