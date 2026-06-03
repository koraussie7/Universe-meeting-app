import { useState } from 'react';
import { FiImage, FiVideo, FiCamera, FiX } from 'react-icons/fi';

export default function CreatePage() {
  const [selected, setSelected] = useState<'reel' | 'post' | 'story' | null>(null);

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 pt-12">
        <h2 className="text-xl font-bold mb-4">Create New</h2>
        <div className="grid grid-cols-1 gap-3 w-64">
          <button
            onClick={() => setSelected('reel')}
            className="flex items-center gap-4 bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-xl font-medium"
          >
            <FiVideo size={24} />
            <div className="text-left">
              <p className="font-bold">Reel</p>
              <p className="text-xs opacity-75">Short video up to 60s</p>
            </div>
          </button>
          <button
            onClick={() => setSelected('post')}
            className="flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-blue-600 p-4 rounded-xl font-medium"
          >
            <FiImage size={24} />
            <div className="text-left">
              <p className="font-bold">Post</p>
              <p className="text-xs opacity-75">Photos & gallery</p>
            </div>
          </button>
          <button
            onClick={() => setSelected('story')}
            className="flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-xl font-medium"
          >
            <FiCamera size={24} />
            <div className="text-left">
              <p className="font-bold">Story</p>
              <p className="text-xs opacity-75">Disappears in 24h</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setSelected(null)}>
          <FiX size={24} className="text-slate-400" />
        </button>
        <h2 className="text-lg font-bold">
          New {selected === 'reel' ? 'Reel' : selected === 'post' ? 'Post' : 'Story'}
        </h2>
      </div>
      <div className="w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
          {selected === 'reel' ? <FiVideo size={32} className="text-pink-400" /> :
           selected === 'post' ? <FiImage size={32} className="text-indigo-400" /> :
           <FiCamera size={32} className="text-emerald-400" />}
        </div>
        <p className="text-slate-400 text-sm">Tap to upload or record</p>
      </div>
      <button className="mt-8 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-medium w-full max-w-sm">
        Coming Soon
      </button>
    </div>
  );
}
