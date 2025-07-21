import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EventForm({ token, edit }) {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', date: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (edit && id) {
      axios.get(`http://localhost:5000/api/events/${id}`)
        .then(res => setForm({
          title: res.data.title,
          description: res.data.description,
          date: res.data.date?.slice(0, 16),
          price: res.data.price || ''
        }));
    }
  }, [edit, id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (edit) {
      await axios.put(`http://localhost:5000/api/events/${id}`, form, config);
    } else {
      await axios.post('http://localhost:5000/api/events', form, config);
    }
    navigate('/calendar');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center justify-center py-16 px-2">
      <div className="w-full max-w-xl flex flex-col items-center justify-center">
        <div className="bg-black/90 rounded-3xl shadow-2xl px-10 py-10 w-full border border-white/10 backdrop-blur-md">
          <h2 className="text-3xl md:text-4xl font-black text-[#b8b8ff] mb-6 text-center font-sans" style={{ fontFamily: 'Inter, Poppins, Arial, sans-serif' }}>{edit ? 'Edit' : 'Create'} Event</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60" />
            <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60" />
            <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60" />
            <button type="submit" className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-mono font-semibold text-lg tracking-widest uppercase shadow-lg hover:bg-[#6241c7] transition border-none">{edit ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </div>
    </div>
  );
} 