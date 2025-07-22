import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Register({ token }) {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  if (!eventId || eventId === 'undefined') {
    return (
      <div className="text-center mt-10 text-white">
        Invalid event. Please select an event from the calendar.
      </div>
    );
  }

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${eventId}`)
      .then(res => setEvent(res.data));
  }, [eventId]);

  const handleBook = async () => {
    setError('');
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/book`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooked(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed');
    }
  };

  if (!event) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center justify-center py-16 px-2">
      <div className="w-full max-w-lg bg-black/90 rounded-3xl shadow-2xl px-10 py-10 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-6 text-center font-sans">Register for {event.title}</h2>
        <p className="text-white/90 mb-2"><span className="font-semibold">Date:</span> {new Date(event.date).toLocaleString()}</p>
        <p className="text-white/90 mb-2"><span className="font-semibold">Description:</span> {event.description}</p>
        {event.price !== undefined && event.price !== null && (
          <p className="text-lg font-semibold text-[#7f5af0] mb-4">Price: ₹{event.price}</p>
        )}
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        {!booked ? (
          <button onClick={handleBook} className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-mono font-semibold text-lg tracking-widest uppercase shadow-lg hover:bg-[#6241c7] transition border-none mt-6">Book Now</button>
        ) : (
          <div className="w-full flex flex-col items-center mt-6">
            <span className="text-green-400 text-2xl mb-2">&#10003;</span>
            <span className="text-green-300 font-bold text-lg">Event booked!</span>
          </div>
        )}
      </div>
    </div>
  );
}