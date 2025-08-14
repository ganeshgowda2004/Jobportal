import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
        </div>
        <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {job.jobType && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">{job.jobType}</span>}
      </div>
      <p className="mt-2 text-sm text-gray-700 max-h-20 overflow-hidden">{job.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">Posted by {job.postedBy?.username || 'Unknown'}</div>
        <Link to={`/jobs/${job._id}`} className="text-brand-700 hover:underline text-sm">View details</Link>
      </div>
    </div>
  );
}