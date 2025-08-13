import React, { useEffect, useState } from 'react';
import { createJob, getJobs } from '../services/api';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createJob({ title, company, location, description });
      toast.success('Job posted');
      setTitle(''); setCompany(''); setLocation(''); setDescription('');
      const { data } = await getJobs();
      setJobs(data);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await getJobs();
      setJobs(data);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Recruiter dashboard</h1>

      <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Job title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border rounded-md px-3 py-2 h-28" />
          </div>
        </div>
        <div className="flex justify-end">
          <button disabled={submitting} className="bg-brand-600 text-white rounded-md px-4 py-2 disabled:opacity-50">{submitting ? 'Posting...' : 'Post job'}</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Recently posted</h2>
        <div className="divide-y bg-white border rounded-lg">
          {jobs.slice(0, 5).map((j) => (
            <div key={j._id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{j.title}</div>
                <div className="text-sm text-gray-600">{j.company} • {j.location}</div>
              </div>
              <div className="text-xs text-gray-500">{new Date(j.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {jobs.length === 0 && <div className="p-3 text-gray-500">No jobs yet.</div>}
        </div>
      </div>
    </div>
  );
}