import React, { useEffect, useState } from 'react';

export default function Feedbacks({ token }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/feedbacks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-2xl mx-auto bg-black/80 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-8 text-center font-sans">User Feedbacks</h2>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-white text-center">No feedbacks yet.</div>
        ) : (
          <ul className="space-y-6">
            {feedbacks.map(fb => (
              <li key={fb._id} className="bg-[#7f5af0]/20 rounded-xl p-4 flex flex-col">
                <div className="text-white font-semibold mb-1">{fb.user?.username || 'Unknown User'}</div>
                <div className="text-white/90 mb-2">{fb.message}</div>
                <div className="text-xs text-white/60">{new Date(fb.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 