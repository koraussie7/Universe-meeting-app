import { useState, useRef } from 'react';
import { FiImage, FiVideo, FiCamera, FiX, FiUpload, FiCheck } from 'react-icons/fi';

type MediaType = 'reel' | 'post' | 'story' | null;

export default function CreatePage() {
  const [selected, setSelected] = useState<MediaType>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ key: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setUploaded(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploaded(data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

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

  const acceptedTypes = selected === 'reel' ? 'video/*' : 'image/*';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => { setSelected(null); setFile(null); setPreview(null); setUploaded(null); }}>
          <FiX size={24} className="text-slate-400" />
        </button>
        <h2 className="text-lg font-bold">
          New {selected === 'reel' ? 'Reel' : selected === 'post' ? 'Post' : 'Story'}
        </h2>
      </div>

      {/* Upload area */}
      {!preview ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center gap-4 hover:border-indigo-500 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
            {selected === 'reel' ? <FiVideo size={32} className="text-pink-400" /> :
             selected === 'post' ? <FiImage size={32} className="text-indigo-400" /> :
             <FiCamera size={32} className="text-emerald-400" />}
          </div>
          <p className="text-slate-400 text-sm">Tap to select a file</p>
        </button>
      ) : (
        <div className="w-full max-w-sm">
          {/* Preview */}
          {selected === 'reel' ? (
            <video src={preview} controls className="w-full rounded-xl" />
          ) : (
            <img src={preview} alt="Preview" className="w-full rounded-xl object-cover" />
          )}

          {/* Upload button */}
          {!uploaded ? (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-3 rounded-xl font-medium w-full flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Uploading to S3...
                </>
              ) : (
                <>
                  <FiUpload size={18} />
                  Upload
                </>
              )}
            </button>
          ) : (
            <div className="mt-4 bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <FiCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-300">Uploaded to S3</p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{uploaded.key}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
