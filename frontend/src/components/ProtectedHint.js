import React from 'react';
import { Link } from 'react-router-dom';

export default function ProtectedHint({ children }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
      {children || (
        <span>Login required. <Link to="/login" className="underline">Login</Link> or <Link to="/signup" className="underline">Sign up</Link>.</span>
      )}
    </div>
  );
}