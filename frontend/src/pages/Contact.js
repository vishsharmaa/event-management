import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSent(false);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/feedbacks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ message: form.message })
        });
        setSent(true);
      } catch (err) {
        setError('Failed to send feedback.');
      }
    } else {
      setError('You must be logged in to send feedback.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center justify-center py-16 px-2">
      <div className="w-full max-w-lg bg-black/90 rounded-3xl shadow-2xl px-10 py-10 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-6 text-center font-sans">Get in Touch</h2>
        {sent ? (
          <div className="text-center text-green-400 text-xl font-bold py-12">Thank you for reaching out!<br/>We will get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5af0] font-semibold placeholder-white/60 min-h-[120px]"
            />
            {error && <div className="text-red-400 text-center">{error}</div>}
            <button type="submit" className="w-full bg-[#7f5af0] text-white py-3 rounded-full font-mono font-semibold text-lg tracking-widest uppercase shadow-lg hover:bg-[#6241c7] transition border-none">Send</button>
          </form>
        )}
      </div>
    </div>
  );
} 