import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobs } from '../services/api';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getJobs();
      setJobs(data);
      setLoading(false);
    })();
  }, []);

  const job = useMemo(() => jobs.find((j) => j._id === id), [jobs, id]);

  const handleApply = () => {
    toast('Apply endpoint not available in backend.');
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">Job not found from list. The backend does not expose GET /api/jobs/:id. Returning to jobs.</div>
      <button onClick={() => navigate('/jobs')} className="mt-4 px-4 py-2 border rounded">Back to Jobs</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
        <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
        <div className="mt-4 prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">{job.description}</p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleApply} className="bg-brand-600 text-white rounded-md px-4 py-2">Apply</button>
          <span className="text-sm text-gray-500">Posted by {job.postedBy?.username || 'Unknown'} on {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}