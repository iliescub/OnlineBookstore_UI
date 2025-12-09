import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { currentUser, isAdmin, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/home?search=${encodeURIComponent(query)}` : '/home');
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center font-bold text-white shadow-lg">
              📚
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartBookstore
              </h1>
              <p className="text-xs text-slate-400">Discover Your Next Read</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 max-w-md flex-1 mx-8">
            <div className="relative flex-1">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books, authors..."
                className="input pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="relative btn btn-ghost"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 btn btn-ghost"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                    {currentUser.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 card animate-fade-in z-20">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-slate-400">
                          {currentUser.email}
                        </div>
                        <div className="px-3 py-2 text-xs">
                          <span className={`badge ${isAdmin ? 'badge-warning' : 'badge-success'}`}>
                            {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </div>
                        <hr className="my-2 border-slate-800" />
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden py-3 border-t border-slate-800">
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, authors..."
              className="input pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              🔍
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
