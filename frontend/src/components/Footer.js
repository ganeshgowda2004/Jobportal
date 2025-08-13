import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Job Portal</span>
        <a className="hover:text-gray-700" href="https://example.com" target="_blank" rel="noreferrer">About</a>
      </div>
    </footer>
  );
}