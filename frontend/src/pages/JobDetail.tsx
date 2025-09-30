import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs, payments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Job, Payment } from '../types';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobs.getById(id!);
      setJob(response.data);
      if (response.data.payment) {
        loadPayment();
      }
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayment = async () => {
    try {
      const response = await payments.getByJob(id!);
      setPayment(response.data);
    } catch (error) {
      console.error('Failed to load payment:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setActionLoading(true);
    setError('');
    try {
      await jobs.updateStatus(id!, newStatus);
      await loadJob();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = () => {
    navigate(`/payments/${id}`);
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="error">Job not found</div>;

  const freelancerName =
    typeof job.freelancer !== 'string' && typeof job.freelancer.user !== 'string'
      ? job.freelancer.user.name
      : 'Unknown';
  const clientName = typeof job.client !== 'string' ? job.client.name : 'Unknown';
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="page-container">
      <div className="job-detail">
        <div className="detail-header">
          <div>
            <h1>{job.title}</h1>
            <span className={`status-badge status-${job.status}`}>{job.status}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="detail-section">
          <h2>Job Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Client</span>
              <span className="value">{clientName}</span>
            </div>
            <div className="info-item">
              <span className="label">Freelancer</span>
              <span className="value">{freelancerName}</span>
            </div>
            <div className="info-item">
              <span className="label">Job Date</span>
              <span className="value">{new Date(job.jobDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Duration</span>
              <span className="value">
                {job.hoursOrDays} {job.durationType === 'hourly' ? 'hours' : 'days'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Price</span>
              <span className="value price">${job.price}</span>
            </div>
            <div className="info-item">
              <span className="label">Created</span>
              <span className="value">{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {job.description && (
            <div className="description">
              <h3>Description</h3>
              <p>{job.description}</p>
            </div>
          )}
        </div>

        {payment && (
          <div className="detail-section">
            <h2>Payment Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Amount</span>
                <span className="value">${payment.amount}</span>
              </div>
              <div className="info-item">
                <span className="label">Status</span>
                <span className={`status-badge status-${payment.status}`}>
                  {payment.status}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Provider</span>
                <span className="value">{payment.provider}</span>
              </div>
              {payment.providerPaymentId && (
                <div className="info-item">
                  <span className="label">Transaction ID</span>
                  <span className="value">{payment.providerPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="detail-actions">
          {isFreelancer && job.status === 'pending' && (
            <>
              <button
                className="btn-primary"
                onClick={() => handleStatusUpdate('accepted')}
                disabled={actionLoading}
              >
                Accept Job
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={actionLoading}
              >
                Decline
              </button>
            </>
          )}

          {isClient && job.status === 'accepted' && !payment && (
            <button className="btn-primary" onClick={handlePayment}>
              Process Payment
            </button>
          )}

          {job.status === 'accepted' && payment?.status === 'succeeded' && (
            <button
              className="btn-primary"
              onClick={() => handleStatusUpdate('completed')}
              disabled={actionLoading}
            >
              Mark as Completed
            </button>
          )}

          {(isClient || isFreelancer) && job.status === 'pending' && (
            <button
              className="btn-secondary"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={actionLoading}
            >
              Cancel Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}