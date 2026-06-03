import { FiVideo, FiUsers, FiLink, FiCalendar } from 'react-icons/fi';

export default function MeetingPage() {
  return (
    <div className="pt-12 px-4">
      <h2 className="text-xl font-bold mb-6">🎥 Live & Meetings</h2>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl text-left">
          <FiVideo size={24} className="mb-3" />
          <p className="font-bold text-sm">New Meeting</p>
          <p className="text-xs text-indigo-200 mt-1">Start instantly</p>
        </button>
        <button className="bg-slate-800 p-4 rounded-xl text-left border border-slate-700">
          <FiCalendar size={24} className="mb-3 text-slate-400" />
          <p className="font-bold text-sm">Schedule</p>
          <p className="text-xs text-slate-400 mt-1">Plan ahead</p>
        </button>
        <button className="bg-slate-800 p-4 rounded-xl text-left border border-slate-700">
          <FiLink size={24} className="mb-3 text-slate-400" />
          <p className="font-bold text-sm">Join</p>
          <p className="text-xs text-slate-400 mt-1">With a link</p>
        </button>
        <button className="bg-slate-800 p-4 rounded-xl text-left border border-slate-700">
          <FiUsers size={24} className="mb-3 text-slate-400" />
          <p className="font-bold text-sm">Go Live</p>
          <p className="text-xs text-slate-400 mt-1">Stream now</p>
        </button>
      </div>

      {/* Upcoming */}
      <h3 className="font-semibold text-slate-400 text-sm mb-3 uppercase tracking-wide">
        Upcoming
      </h3>
      <div className="space-y-3">
        {[
          { title: 'Weekly Jam Session', time: 'Tomorrow 8PM', host: 'void_musician', color: 'bg-rose-900/50' },
          { title: 'Code & Coffee', time: 'Thu 10AM', host: 'quantum_dev', color: 'bg-blue-900/50' },
        ].map((event, i) => (
          <div key={i} className={`${event.color} p-4 rounded-xl border border-slate-700/50`}>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-slate-400 mt-1">
              {event.time} · hosted by {event.host}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
