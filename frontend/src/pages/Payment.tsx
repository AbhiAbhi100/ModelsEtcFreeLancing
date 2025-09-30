import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs, payments } from '../services/api';
import type { Job } from '../types';

export default function Payment() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (jobId) loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const response = await jobs.getById(jobId!);
      setJob(response.data);
      if (typeof response.data.client !== 'string') {
        setReceiptEmail(response.data.client.email);
      }
    } catch (error) {
      console.error('Failed to load job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setProcessing(true);
    setError('');

    try {
      await payments.create(jobId!, {
        amount: job.price,
        receiptEmail: receiptEmail || undefined,
      });
      navigate(`/jobs/${jobId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading payment details...</div>;
  if (!job) return <div className="error">Job not found</div>;

  const freelancerName =
    typeof job.freelancer !== 'string' && typeof job.freelancer.user !== 'string'
      ? job.freelancer.user.name
      : 'Unknown';

  return (
    <div className="page-container">
      <div className="payment-page">
        <h1>Complete Payment</h1>

        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Job Title</span>
            <span>{job.title}</span>
          </div>
          <div className="summary-item">
            <span>Freelancer</span>
            <span>{freelancerName}</span>
          </div>
          <div className="summary-item">
            <span>Duration</span>
            <span>
              {job.hoursOrDays} {job.durationType === 'hourly' ? 'hours' : 'days'}
            </span>
          </div>
          <div className="summary-item">
            <span>Job Date</span>
            <span>{new Date(job.jobDate).toLocaleDateString()}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item total">
            <span>Total Amount</span>
            <span>${job.price}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handlePayment} className="payment-form">
          <h2>Payment Details</h2>

          <div className="form-group">
            <label htmlFor="receiptEmail">Receipt Email</label>
            <input
              id="receiptEmail"
              type="email"
              value={receiptEmail}
              onChange={(e) => setReceiptEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <small>Optional: Email to receive payment receipt</small>
          </div>

          <div className="payment-info">
            <p>
              This is a demo payment system. In production, this would integrate with a real
              payment provider like Stripe.
            </p>
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={processing}>
            {processing ? 'Processing Payment...' : `Pay $${job.price}`}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/jobs/${jobId}`)}
            disabled={processing}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}