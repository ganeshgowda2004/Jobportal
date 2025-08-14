import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobs, applyForJob } from '../services/api';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getJobs();
      setJobs(data);
      setLoading(false);
    })();
  }, []);

  const job = useMemo(() => jobs.find((j) => j._id === id), [jobs, id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      if (resumeFile) form.append('resume', resumeFile);
      if (coverLetter) form.append('coverLetter', coverLetter);
      await applyForJob(id, form);
      toast.success('Applied successfully');
      setCoverLetter('');
      setResumeFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">Job not found from list. Returning to jobs.</div>
      <button onClick={() => navigate('/jobs')} className="mt-4 px-4 py-2 border rounded">Back to Jobs</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
        <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
        <div className="mt-2">{job.jobType && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">{job.jobType}</span>}</div>
        <div className="mt-4 prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">{job.description}</p>
        </div>
      </div>

      <form onSubmit={handleApply} className="bg-white border rounded-lg p-6 mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Apply to this job</h2>
        <div>
          <label className="block text-sm mb-1">Cover letter (optional)</label>
          <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full border rounded-md px-3 py-2 h-28" />
        </div>
        <div>
          <label className="block text-sm mb-1">Resume (PDF/DOC/DOCX, optional)</label>
          <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        </div>
        <div className="flex justify-end">
          <button disabled={submitting} className="bg-brand-600 text-white rounded-md px-4 py-2 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit application'}</button>
        </div>
      </form>
    </div>
  );
}