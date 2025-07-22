import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import EventForm from './pages/EventForm';
import Calendar from './pages/Calendar';
import Registered from './pages/Registered';
import Contact from './pages/Contact';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Events from './pages/Events';
import Feedbacks from './pages/Feedbacks';

function NavBarWithSearch({ token, username, setToken, setUsername, handleLogout, dropdownOpen, setDropdownOpen, scrolled, role }) {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [allEvents, setAllEvents] = React.useState([]);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchRef = React.useRef();
  const navigate = useNavigate();

  const fetchEvents = React.useCallback(() => {
    axios.get('http://localhost:5000/api/events').then(res => setAllEvents(res.data));
  }, []);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  React.useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    setSearchResults(
      allEvents.filter(ev =>
        ev.title.toLowerCase().includes(q) ||
        (ev.description && ev.description.toLowerCase().includes(q))
      )
    );
  }, [search, allEvents]);

  React.useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    if (searchOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen]);

  const navClass = scrolled
    ? 'backdrop-blur-md bg-black/60 border-b border-white/20 shadow-lg'
    : 'bg-transparent border-none shadow-none';
  const navTransition = 'transition-all duration-300';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 py-3 px-0 ${navClass} ${navTransition}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-lg font-light tracking-widest text-white/80 hover:text-[#7f5af0] transition font-sans" style={{ fontFamily: 'Poppins, Inter, Arial, sans-serif' }}>Eventify</Link>
          <div className="relative hidden sm:block" ref={searchRef}>
            <input
              type="text"
              placeholder="Search events..."
              className="pl-4 pr-10 py-2 rounded-full bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition w-56 placeholder-white/60 shadow-md"
              style={{ minWidth: '180px' }}
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => { fetchEvents(); setSearchOpen(true); }}
              autoComplete="off"
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7f5af0] hover:text-[#6241c7] focus:outline-none" tabIndex={-1}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
            </button>
            {searchOpen && search && (
              <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-black/95 border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-white/70 text-center">No events found</div>
                ) : (
                  <ul>
                    {searchResults.map(ev => (
                      <li key={ev._id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-[#7f5af0]/30 text-white flex flex-col border-b border-white/10 last:border-b-0 transition"
                          onClick={() => { setSearch(''); setSearchOpen(false); navigate(`/register/${ev._id}`); }}
                        >
                          <span className="font-semibold text-lg">{ev.title}</span>
                          <span className="text-white/70 text-sm truncate">{ev.description}</span>
                          {ev.price !== undefined && ev.price !== null && (
                            <span className="text-[#b8b8ff] font-mono text-xs mt-1">₹{ev.price}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-x-6 text-lg font-semibold flex items-center">
          <Link to="/" className="text-white hover:text-[#7f5af0] transition">Home</Link>
          <Link to="/events" className="text-white hover:text-[#7f5af0] transition">Events</Link>
          {token && (
            <>
              <Link to="/calendar" className="text-white hover:text-[#7f5af0] transition">Calendar</Link>
              <Link to="/registered" className="text-white hover:text-[#7f5af0] transition">Registered</Link>
              {role === 'admin' && (
                <Link to="/users" className="text-white hover:text-[#7f5af0] transition">All Users</Link>
              )}
            </>
          )}
          {token ? (
            <div className="relative" id="user-dropdown">
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center text-white hover:text-[#7f5af0] transition focus:outline-none"
              >
                <span className="mr-1">{username || 'User'}</span>
                <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-[#7f5af0] transition">Login</Link>
              <Link to="/register" className="text-white hover:text-[#7f5af0] transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function AllUsers({ token }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    fetch('http://localhost:5000/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, [token]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7f5af0] via-[#232946] to-black flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-2xl mx-auto bg-black/80 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-black text-[#b8b8ff] mb-8 text-center font-sans">All Users</h2>
        {loading ? <div className="text-white text-center">Loading...</div> : (
          <ul className="space-y-4">
            {users.map(u => (
              <li key={u._id || u.id} className="bg-[#7f5af0]/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-white font-semibold">{u.username}</span>
                <span className="text-[#b8b8ff] font-mono text-sm">{u.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [username, setUsername] = React.useState(localStorage.getItem('username'));
  const [role, setRole] = React.useState(localStorage.getItem('role'));
  const [scrolled, setScrolled] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#user-dropdown')) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleLogin = (token, username, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    setToken(token);
    setUsername(username);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken(null);
    setUsername(null);
    setRole(null);
    setDropdownOpen(false);
    window.location = '/';
  };

  return (
    <BrowserRouter>
      <NavBarWithSearch
        token={token}
        username={username}
        setToken={setToken}
        setUsername={setUsername}
        handleLogout={handleLogout}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        scrolled={scrolled}
        role={role}
      />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<EventList token={token} role={role} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/register/:eventId" element={<Register token={token} role={role} />} />
          <Route path="/registered" element={<Registered token={token} role={role} />} />
          <Route path="/events" element={<Events token={token} role={role} />} />
          <Route path="/events/:id" element={<EventDetails token={token} role={role} />} />
          <Route path="/create" element={token && role === 'admin' ? <EventForm token={token} /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={token && role === 'admin' ? <EventForm token={token} edit /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={token ? <Calendar token={token} /> : <Navigate to="/login" />} />
          <Route path="/users" element={token && role === 'admin' ? <AllUsers token={token} /> : <Navigate to="/login" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedbacks" element={token && role === 'admin' ? <Feedbacks token={token} role={role} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App; 