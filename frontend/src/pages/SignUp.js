import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login'); // Always redirect to login after sign up
    } catch (err) {
      setError(err.response?.data?.msg || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black">
      <form onSubmit={handleSubmit} className="bg-black/90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#b8b8ff] mb-6 text-center">Sign Up</h2>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none"
        />
        <button type="submit" className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-bold text-lg hover:bg-[#6241c7] transition">Sign Up</button>
      </form>
    </div>
  );
}