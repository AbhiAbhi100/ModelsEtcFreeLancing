import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Job } from '../types';

export default function Jobs() {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobs.getAll();
      setJobsList(response.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobsList.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      accepted: 'status-accepted',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return classes[status] || '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Jobs</h1>
        {user?.role === 'client' && (
          <Link to="/freelancers" className="btn-primary">
            Hire Freelancer
          </Link>
        )}
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job) => {
            const freelancerName =
              typeof job.freelancer !== 'string' && typeof job.freelancer.user !== 'string'
                ? job.freelancer.user.name
                : 'Unknown';
            const clientName =
              typeof job.client !== 'string' ? job.client.name : 'Unknown';

            return (
              <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`status-badge ${getStatusClass(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="job-details">
                  <p className="job-description">{job.description || 'No description'}</p>
                  <div className="job-meta">
                    <div className="meta-item">
                      <span className="label">
                        {user?.role === 'client' ? 'Freelancer:' : 'Client:'}
                      </span>
                      <span className="value">
                        {user?.role === 'client' ? freelancerName : clientName}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Date:</span>
                      <span className="value">
                        {new Date(job.jobDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Duration:</span>
                      <span className="value">
                        {job.hoursOrDays} {job.durationType === 'hourly' ? 'hours' : 'days'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Price:</span>
                      <span className="value price">${job.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {filteredJobs.length === 0 && (
            <div className="empty-state">
              {filter === 'all' ? 'No jobs yet' : `No ${filter} jobs`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}