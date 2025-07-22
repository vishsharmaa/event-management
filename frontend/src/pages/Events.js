import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Events({ token, role }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    setDeleting(eventId);
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events => events.filter(ev => ev._id !== eventId));
    } catch (err) {
      alert('Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-4xl mx-auto bg-black/80 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-8 text-center font-sans">All Events</h2>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-white text-center">No events found.</div>
        ) : (
          <ul className="space-y-6">
            {events.map(ev => (
              <li key={ev._id} className="bg-[#7f5af0]/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xl font-bold text-white mb-1">{ev.title}</div>
                  <div className="text-white/80 text-sm mb-1">{new Date(ev.date).toLocaleString()}</div>
                  <div className="text-white/80 text-sm">{ev.description}</div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Link to={`/register/${ev._id}`} className="bg-[#7f5af0] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#6241c7] transition">View & Register</Link>
                  {role === 'admin' && (
                    <>
                      <button
                        onClick={() => navigate(`/edit/${ev._id}`)}
                        className="ml-2 p-2 rounded-full hover:bg-yellow-400/30 transition"
                        title="Edit event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 hover:text-yellow-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414a1 1 0 01-1.263-1.263l1.414-4.243a4 4 0 01.828-1.414z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(ev._id)}
                        className="ml-2 p-2 rounded-full hover:bg-red-600/30 transition"
                        title="Delete event"
                        disabled={deleting === ev._id}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 