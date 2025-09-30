import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { freelancers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { FreelancerProfile } from '../types';

export default function FreelancerDetail() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const response = await freelancers.getById(id!);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHireClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/jobs/create?freelancerId=${id}`);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  const userName = typeof profile.user === 'string' ? 'Unknown' : profile.user.name;

  return (
    <div className="page-container">
      <div className="profile-detail">
        <div className="profile-header">
          <div className="profile-main">
            <div className="profile-avatar">
              {profile.media.length > 0 ? (
                <img src={profile.media[0].url} alt={profile.displayName || userName} />
              ) : (
                <div className="avatar-placeholder">{userName.charAt(0)}</div>
              )}
            </div>
            <div className="profile-info">
              <h1>{profile.displayName || userName}</h1>
              <p className="category">{profile.category.toUpperCase()}</p>
              {profile.location && <p className="location">📍 {profile.location}</p>}
              <div className="stats">
                <div className="stat">
                  <span className="stat-value">⭐ {profile.rating.toFixed(1)}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.jobsCompleted}</span>
                  <span className="stat-label">Jobs Completed</span>
                </div>
                <div className="stat">
                  <span className={`status ${profile.isAvailable ? 'available' : 'busy'}`}>
                    {profile.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {profile.hourlyRate && (
              <div className="rate-box">
                <span className="rate-label">Hourly Rate</span>
                <span className="rate-value">${profile.hourlyRate}</span>
              </div>
            )}
            {profile.dailyRate && (
              <div className="rate-box">
                <span className="rate-label">Daily Rate</span>
                <span className="rate-value">${profile.dailyRate}</span>
              </div>
            )}
            {user?.role === 'client' && profile.isAvailable && (
              <button className="btn-primary" onClick={handleHireClick}>
                Hire Now
              </button>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="profile-section">
            <h2>About</h2>
            <p>{profile.bio}</p>
          </div>
        )}

        {profile.skills.length > 0 && (
          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.media.length > 1 && (
          <div className="profile-section">
            <h2>Portfolio</h2>
            <div className="media-grid">
              {profile.media.map((item, index) => (
                <div key={index} className="media-item">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={`Portfolio ${index + 1}`} />
                  ) : (
                    <video src={item.url} controls />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}