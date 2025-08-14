import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../services/api';

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const fetchApps = async (st) => {
    setLoading(true);
    const { data } = await getMyApplications(st ? { status: st } : {});
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps('');
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">My applications</h1>

      <div className="flex items-center gap-3 mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Any status</option>
          <option>Pending</option>
          <option>Reviewed</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
        <button onClick={() => fetchApps(status)} className="bg-brand-600 text-white rounded px-3 py-2">Filter</button>
      </div>

      <div className="bg-white border rounded-lg divide-y">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-4 text-gray-600">No applications yet.</div>
        ) : (
          applications.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.job?.title}</div>
                <div className="text-sm text-gray-600">{a.job?.company} • {a.job?.location} {a.job?.jobType ? `• ${a.job.jobType}` : ''}</div>
                {a.coverLetter && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{a.coverLetter}</div>}
                {a.resumeUrl && <a className="text-xs text-brand-700" href={a.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
              </div>
              <div className="text-right">
                <div className="text-sm"><span className="inline-block text-xs border rounded px-2 py-0.5">{a.status}</span></div>
                <div className="text-xs text-gray-500 mt-1">{new Date(a.appliedAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}