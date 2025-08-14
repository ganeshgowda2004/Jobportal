import React, { useEffect, useMemo, useState } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchJobs = async (jt) => {
    setLoading(true);
    const { data } = await getJobs(jt ? { jobType: jt } : {});
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs('');
  }, []);

  const filtered = useMemo(() => {
    const base = jobs.filter((j) =>
      (!query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase())) &&
      (!location || j.location.toLowerCase().includes(location.toLowerCase()))
    );
    return base;
  }, [jobs, query, location]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [query, location, jobType]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>

      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or company" className="border rounded-md px-3 py-2" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="border rounded-md px-3 py-2" />
        <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="border rounded-md px-3 py-2">
          <option value="">Any job type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Temporary</option>
          <option>Freelance</option>
        </select>
        <button onClick={() => fetchJobs(jobType)} className="bg-brand-600 text-white rounded-md px-4 py-2">Filter</button>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">Loading...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageItems.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">{filtered.length} jobs • Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded disabled:opacity-50">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}