import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Registered({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/booked', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Remove this booking?')) return;
    setDeleting(eventId);
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/book`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events => events.filter(ev => ev._id !== eventId));
    } catch (err) {
      alert('Failed to delete booking');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-2xl mx-auto bg-black/80 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-8 text-center font-sans">Registered Events</h2>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-white text-center">You have not booked any events yet.</div>
        ) : (
          <ul className="space-y-6">
            {events.map(ev => (
              <li key={ev._id} className="bg-[#7f5af0]/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="text-xl font-bold text-white mb-1">{ev.title}</div>
                  <div className="text-white/80 text-sm mb-1">{new Date(ev.date).toLocaleString()}</div>
                  <div className="text-white/80 text-sm">{ev.description}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  {ev.price !== undefined && ev.price !== null && (
                    <div className="text-lg font-semibold text-[#7f5af0]">₹{ev.price}</div>
                  )}
                  <button
                    onClick={() => handleDelete(ev._id)}
                    className="ml-2 p-2 rounded-full hover:bg-red-600/30 transition"
                    title="Delete booking"
                    disabled={deleting === ev._id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 