import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = firstDay.getDay();
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [modal, setModal] = useState({ open: false, day: null, events: [] });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => setEvents(res.data));
  }, []);

  const monthMatrix = getMonthMatrix(current.year, current.month);
  const monthName = new Date(current.year, current.month).toLocaleString('default', { month: 'long' });

  function eventsForDay(day) {
    if (!day) return [];
    return events.filter(ev => {
      if (!ev.date) return false;
      if (ev.price === undefined || ev.price === null) return false;
      const evDate = new Date(ev.date);
      return (
        evDate.getFullYear() === day.getFullYear() &&
        evDate.getMonth() === day.getMonth() &&
        evDate.getDate() === day.getDate()
      );
    });
  }

  function handleDayClick(day) {
    const evs = eventsForDay(day);
    if (!day || evs.length === 0) return;
    if (evs.length === 1) {
      navigate(`/register/${evs[0]._id}`);
    } else {
      setModal({ open: true, day, events: evs });
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-4xl mx-auto bg-black/80 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrent(c => ({ year: c.month === 0 ? c.year - 1 : c.year, month: c.month === 0 ? 11 : c.month - 1 }))} className="text-white text-2xl px-2">&#8592;</button>
          <h2 className="text-3xl font-black text-[#b8b8ff] text-center" style={{ fontFamily: 'Inter, Poppins, Arial, sans-serif' }}>{monthName} {current.year}</h2>
          <button onClick={() => setCurrent(c => ({ year: c.month === 11 ? c.year + 1 : c.year, month: c.month === 11 ? 0 : c.month + 1 }))} className="text-white text-2xl px-2">&#8594;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-center text-white/70 font-semibold">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthMatrix.flat().map((day, i) => {
            const evs = eventsForDay(day);
            const clickable = day && evs.length > 0;
            return (
              <div
                key={i}
                className={`min-h-[90px] rounded-xl p-2 bg-white/10 border border-white/10 flex flex-col ${day ? 'text-white' : 'opacity-30'} ${clickable ? 'cursor-pointer hover:bg-[#7f5af0]/30 transition' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="font-bold mb-1 text-sm">{day ? day.getDate() : ''}</div>
                <div className="flex flex-col gap-1">
                  {evs.map(ev => (
                    <div key={ev._id} className="bg-[#7f5af0] text-white rounded px-2 py-1 text-xs font-semibold shadow mb-1">
                      {ev.title}
                      {ev.price !== undefined && ev.price !== null && (
                        <span className="ml-2 text-white/80 font-mono">₹{ev.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>    
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
              <button onClick={() => setModal({ open: false, day: null, events: [] })} className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-xl font-bold mb-4 text-center">Events on {modal.day && modal.day.toLocaleDateString()}</h3>
              <ul className="space-y-3">
                {modal.events.map(ev => (
                  <li key={ev._id}>
                    <button
                      onClick={() => navigate(`/register/${ev._id}`)}
                      className="w-full text-left bg-[#7f5af0] text-white rounded px-4 py-2 font-semibold hover:bg-[#6241c7] transition"
                    >
                      {ev.title}
                      {ev.price !== undefined && ev.price !== null && (
                        <span className="ml-2 text-white/80 font-mono">₹{ev.price}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 