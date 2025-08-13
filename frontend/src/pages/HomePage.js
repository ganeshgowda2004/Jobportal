import React, { useEffect, useMemo, useState } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await getJobs();
      setJobs(data);
    })();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) =>
      (!query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase())) &&
      (!location || j.location.toLowerCase().includes(location.toLowerCase()))
    ).slice(0, 6);
  }, [jobs, query, location]);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-transparent">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find your next great opportunity</h1>
            <p className="mt-3 text-gray-600">Search thousands of jobs across roles, locations, and companies.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or company" className="border rounded-md px-3 py-2" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="border rounded-md px-3 py-2" />
              <button className="bg-brand-600 text-white rounded-md px-4 py-2">Search</button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-600">Fast, clean, and modern job search.</p>
              <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Minimalist UI</li>
                <li>Responsive design</li>
                <li>Secure authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured jobs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-500">No jobs match the current filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}