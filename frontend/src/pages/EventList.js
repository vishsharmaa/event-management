import React from 'react';
import { Link } from 'react-router-dom';

export default function EventList({ token, role }) {
  // Example stats and avatars (replace with real data if needed)
  const stats = [
    { label: 'Events Hosted', value: '192k' },
    { label: 'Active Users', value: '34' },
    { label: 'Communities', value: '1200+' },
  ];
  const avatars = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/33.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      {/* Hero Section */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-20 mt-8 md:mt-16 gap-8 md:gap-0">
        {/* Headline */}
        <div className="flex-1 text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-sans leading-tight mb-2" style={{ fontFamily: 'Inter, Poppins, Arial, sans-serif' }}>
            Eventify<br />
            <span className="font-black">Empowering Modern Event Experiences</span>
          </h1>
        </div>
        {/* Description and Button */}
        <div className="flex-1 flex flex-col items-start md:items-start justify-center md:pl-12">
          <p className="text-base md:text-lg lg:text-xl font-light text-white/90 mb-6 text-left max-w-md" style={{ fontFamily: 'Inter, Poppins, Arial, sans-serif' }}>
            &#125; Renowned for powering the backbone of event communities with our state-of-the-art management, discovery, and sharing platform.
          </p>
          {role === 'admin' ? (
            <Link
              to="/feedbacks"
              className="inline-block bg-black text-white px-12 py-4 rounded-full font-mono font-semibold text-base md:text-lg tracking-widest uppercase shadow-lg hover:bg-[#7f5af0] hover:text-white transition border-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Feedbacks
            </Link>
          ) : (
            <Link
              to="/contact"
              className="inline-block bg-black text-white px-12 py-4 rounded-full font-mono font-semibold text-base md:text-lg tracking-widest uppercase shadow-lg hover:bg-[#7f5af0] hover:text-white transition border-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Get in Touch
            </Link>
          )}
        </div>
      </div>
      {/* Stylish Stat Card Section */}
      <div className="relative w-full flex flex-col items-center mt-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-end justify-between gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-black/90 rounded-3xl shadow-2xl px-10 py-10 flex flex-col items-center min-w-[220px] md:min-w-[260px] border border-white/10 backdrop-blur-md mb-8 md:mb-0"
              style={{ zIndex: 2, marginLeft: i === 0 ? 0 : '-2rem' }}
            >
              <span className="text-5xl md:text-6xl font-black text-[#b8b8ff] mb-2">{stat.value}</span>
              <span className="text-white/80 text-lg font-semibold text-center">{stat.label}</span>
            </div>
          ))}
        </div>
        {/* Avatars Row */}
        <div className="flex items-center justify-center gap-2 mt-[-2.5rem] z-10">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-white object-cover"
              style={{ zIndex: 10 - i, marginLeft: i === 0 ? 0 : '-1rem' }}
            />
          ))}
        </div>
      </div>
      {/* Floating Create Button */}
      {token && role === 'admin' && (
        <Link
          to="/create"
          className="fixed bottom-8 right-8 z-50 bg-[#7f5af0] text-white rounded-full shadow-lg p-5 flex items-center justify-center text-3xl hover:bg-[#6241c7] transition"
          title="Create Event"
        >
          +
        </Link>
      )}
    </div>
  );
} 