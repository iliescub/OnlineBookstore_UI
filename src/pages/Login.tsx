import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const demoCredentials = [
    { label: 'Admin', email: 'admin@bookstore.com', password: 'admin123' },
    { label: 'User', email: 'user@example.com', password: 'user123' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await signup({ email: formData.email, password: formData.password, name: formData.name });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">
        {/* Left Side - Info */}
        <div className="card p-8 lg:p-12 space-y-6 order-2 lg:order-1">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back!' : 'Join SmartBookstore'}
            </h1>
            <p className="text-slate-400">
              {isLogin
                ? 'Sign in to continue your reading journey'
                : 'Create an account to start building your library'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300">Why join us?</h2>
            <ul className="space-y-3">
              {[
                'Browse thousands of books across all genres',
                'Get personalized recommendations',
                'Track your orders and reading progress',
                'Exclusive deals and early access',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Demo Credentials */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <div key={cred.label} className="text-sm">
                  <span className="text-purple-400 font-medium">{cred.label}:</span>
                  <div className="flex gap-2 mt-1">
                    <code className="bg-slate-900 px-2 py-1 rounded text-xs flex-1">
                      {cred.email}
                    </code>
                    <code className="bg-slate-900 px-2 py-1 rounded text-xs">
                      {cred.password}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="card p-8 lg:p-12 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-medium text-sm"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="input"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="input"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
