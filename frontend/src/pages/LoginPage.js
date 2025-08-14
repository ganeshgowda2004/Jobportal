import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = await login({ username, password });
      if (role === 'recruiter') navigate('/recruiter');
      else if (role === 'applicant') navigate('/applications');
      else navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <button disabled={loading} className="w-full bg-brand-600 text-white rounded-md py-2 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">No account? <Link to="/signup" className="text-brand-700">Sign up</Link></p>
    </div>
  );
}