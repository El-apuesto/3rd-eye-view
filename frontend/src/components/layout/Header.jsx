import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-purple-400">3rd Eye</span> View
          </Link>

          <nav className="flex items-center gap-6">
            {token ? (
              <>
                <Link to="/analysis" className="hover:text-purple-400 transition">
                  Analysis
                </Link>
                <Link to="/history" className="hover:text-purple-400 transition">
                  History
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-400">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/analysis" className="hover:text-purple-400 transition">
                  Analysis
                </Link>
                <Link
                  to="/login"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}