import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobs, freelancers } from '../services/api';
import type { FreelancerProfile } from '../types';

export default function CreateJob() {
  const [searchParams] = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [durationType, setDurationType] = useState<'hourly' | 'daily'>('hourly');
  const [hoursOrDays, setHoursOrDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (freelancerId) {
      loadFreelancer();
    }
  }, [freelancerId]);

  const loadFreelancer = async () => {
    try {
      const response = await freelancers.getById(freelancerId!);
      setFreelancer(response.data);
      if (response.data.hourlyRate) {
        setDurationType('hourly');
      } else if (response.data.dailyRate) {
        setDurationType('daily');
      }
    } catch (error) {
      console.error('Failed to load freelancer:', error);
    }
  };

  const calculatePrice = () => {
    if (!freelancer) return 0;
    const rate = durationType === 'hourly' ? freelancer.hourlyRate : freelancer.dailyRate;
    return (rate || 0) * hoursOrDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancerId) {
      setError('Freelancer not selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jobData = {
        freelancer: freelancerId,
        title,
        description,
        jobDate,
        durationType,
        hoursOrDays,
        price: calculatePrice(),
      };

      const response = await jobs.create(jobData);
      navigate(`/jobs/${response.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (freelancerId && !freelancer) {
    return <div className="loading">Loading freelancer details...</div>;
  }

  const userName = freelancer && typeof freelancer.user !== 'string' ? freelancer.user.name : 'Unknown';

  return (
    <div className="page-container">
      <div className="form-page">
        <h1>Create New Job</h1>

        {freelancer && (
          <div className="selected-freelancer">
            <div className="freelancer-info">
              <div className="avatar-small">
                {freelancer.media.length > 0 ? (
                  <img src={freelancer.media[0].url} alt={userName} />
                ) : (
                  <div className="avatar-placeholder">{userName.charAt(0)}</div>
                )}
              </div>
              <div>
                <h3>{freelancer.displayName || userName}</h3>
                <p>{freelancer.category}</p>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Event Security Service"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide details about the job..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDate">Job Date</label>
            <input
              id="jobDate"
              type="date"
              value={jobDate}
              onChange={(e) => setJobDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="durationType">Duration Type</label>
              <select
                id="durationType"
                value={durationType}
                onChange={(e) => setDurationType(e.target.value as 'hourly' | 'daily')}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hoursOrDays">
                {durationType === 'hourly' ? 'Hours' : 'Days'}
              </label>
              <input
                id="hoursOrDays"
                type="number"
                value={hoursOrDays}
                onChange={(e) => setHoursOrDays(Number(e.target.value))}
                required
                min={1}
              />
            </div>
          </div>

          {freelancer && (
            <div className="price-summary">
              <div className="price-row">
                <span>Rate:</span>
                <span>
                  ${durationType === 'hourly' ? freelancer.hourlyRate : freelancer.dailyRate}/
                  {durationType === 'hourly' ? 'hour' : 'day'}
                </span>
              </div>
              <div className="price-row">
                <span>Duration:</span>
                <span>
                  {hoursOrDays} {durationType === 'hourly' ? 'hour(s)' : 'day(s)'}
                </span>
              </div>
              <div className="price-row total">
                <span>Total Price:</span>
                <span>${calculatePrice()}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Job...' : 'Create Job'}
          </button>
        </form>
      </div>
    </div>
  );
}