import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-700 hover:text-brand-600'}`;

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-600 text-white grid place-items-center font-bold">J</div>
            <span className="font-semibold text-lg">Job Portal</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
            {isAuthenticated && (
              <>
                {role === 'recruiter' && <NavLink to="/recruiter" className={linkClass}>Recruiter</NavLink>}
                {role === 'applicant' && <NavLink to="/applications" className={linkClass}>Applications</NavLink>}
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-3 py-2 text-sm rounded-md border">Login</Link>
                <Link to="/signup" className="px-3 py-2 text-sm rounded-md bg-brand-600 text-white">Sign up</Link>
              </>
            ) : (
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-2 text-sm rounded-md border"
              >Logout</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}