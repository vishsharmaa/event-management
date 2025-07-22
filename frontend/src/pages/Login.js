import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      if (onLogin) onLogin(res.data.token, res.data.username, res.data.role);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center justify-center py-16 px-2">
      <div className="w-full max-w-lg bg-black/90 rounded-3xl shadow-2xl px-10 py-10 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-6 text-center font-sans">Login</h2>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60"
          />
          <button type="submit" className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-mono font-semibold text-lg tracking-widest uppercase shadow-lg hover:bg-[#6241c7] transition border-none">Login</button>
        </form>
      </div>
    </div>
  );
} 