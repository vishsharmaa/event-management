import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetails({ token }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(`http://localhost:5000/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/');
  };

  if (!event) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-8 mt-10">
      <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p className="text-gray-500 mb-2">Date: {new Date(event.date).toLocaleString()}</p>
      <p className="text-gray-500 mb-6">By: {event.createdBy?.username}</p>
      {event.price !== undefined && event.price !== null && (
        <p className="text-lg font-semibold text-[#7f5af0] mb-4">Price: ₹{event.price}</p>
      )}
      <button className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-mono font-semibold text-lg tracking-widest uppercase shadow-lg hover:bg-[#6241c7] transition border-none mb-6">Book Now</button>
      <div className="flex space-x-4 mb-4">
        {token && (
          <>
            <Link to={`/edit/${event._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Edit</Link>
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Delete</button>
          </>
        )}
        <Link to="/" className="ml-auto text-blue-600 hover:underline">Back to Events</Link>
      </div>
    </div>
  );
} 