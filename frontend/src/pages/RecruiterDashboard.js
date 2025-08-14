import React, { useEffect, useState } from 'react';
import { createJob, getJobs, getRecruiterApplications, updateApplicationStatus, getRecruiterJobApplications } from '../services/api';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsJobType, setAppsJobType] = useState('');
  const [appsStatus, setAppsStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createJob({ title, company, location, description, jobType });
      toast.success('Job posted');
      setTitle(''); setCompany(''); setLocation(''); setDescription(''); setJobType('Full-time');
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

  const fetchAllApps = async () => {
    setAppsLoading(true);
    const { data } = await getRecruiterApplications({ jobType: appsJobType || undefined, status: appsStatus || undefined });
    setApps(data);
    setAppsLoading(false);
  };

  useEffect(() => {
    fetchAllApps();
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    await updateApplicationStatus(applicationId, { status });
    toast.success('Status updated');
    fetchAllApps();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          <div>
            <label className="block text-sm mb-1">Job type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
              <option>Freelance</option>
            </select>
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

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recently posted</h2>
          <div className="divide-y bg-white border rounded-lg">
            {jobs.slice(0, 5).map((j) => (
              <div key={j._id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-gray-600">{j.company} • {j.location} {j.jobType ? `• ${j.jobType}` : ''}</div>
                </div>
                <div className="text-xs text-gray-500">{new Date(j.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
            {jobs.length === 0 && <div className="p-3 text-gray-500">No jobs yet.</div>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Applications</h2>
            <div className="flex items-center gap-2">
              <select value={appsJobType} onChange={(e) => setAppsJobType(e.target.value)} className="border rounded px-2 py-1">
                <option value="">Any type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Temporary</option>
                <option>Freelance</option>
              </select>
              <select value={appsStatus} onChange={(e) => setAppsStatus(e.target.value)} className="border rounded px-2 py-1">
                <option value="">Any status</option>
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
              <button onClick={() => fetchAllApps()} className="bg-brand-600 text-white rounded px-3 py-1.5">Filter</button>
            </div>
          </div>
          <div className="bg-white border rounded-lg divide-y">
            {appsLoading ? (
              <div className="p-3">Loading...</div>
            ) : apps.length === 0 ? (
              <div className="p-3 text-gray-600">No applications found.</div>
            ) : (
              apps.map((a) => (
                <div key={a.id} className="p-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-600">{a.applicant?.username} • {a.applicant?.email}</div>
                    <div className="font-medium">{a.job?.title}</div>
                    <div className="text-sm text-gray-600">{a.job?.company} • {a.job?.location} {a.job?.jobType ? `• ${a.job.jobType}` : ''}</div>
                    {a.resumeUrl && <a className="text-xs text-brand-700" href={a.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
                    {a.coverLetter && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{a.coverLetter}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500">{new Date(a.appliedAt).toLocaleString()}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <select value={a.status} onChange={(e) => handleStatusChange(a.id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                        <option>Pending</option>
                        <option>Reviewed</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}