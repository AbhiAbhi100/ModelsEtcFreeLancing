import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { freelancers } from '../services/api';
import type { FreelancerProfile } from '../types';

const categories = ['bodyguard', 'anchor', 'actor', 'model', 'dancer', 'others'];

export default function Freelancers() {
  const [profiles, setProfiles] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFreelancers();
  }, [category]);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const params: any = { isAvailable: true };
      if (category) params.category = category;
      const response = await freelancers.getAll(params);
      setProfiles(response.data);
    } catch (error) {
      console.error('Failed to load freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const displayName = typeof profile.user === 'string' ? '' : profile.user.name;
    const searchLower = search.toLowerCase();
    return (
      displayName.toLowerCase().includes(searchLower) ||
      profile.category.toLowerCase().includes(searchLower) ||
      profile.bio?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find Freelancers</h1>
        <p>Browse talented professionals for your next project</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, category, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button
            className={`filter-btn ${!category ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading freelancers...</div>
      ) : (
        <div className="freelancer-grid">
          {filteredProfiles.map((profile) => {
            const userName = typeof profile.user === 'string' ? 'Unknown' : profile.user.name;
            return (
              <Link to={`/freelancers/${profile._id}`} key={profile._id} className="freelancer-card">
                <div className="card-image">
                  {profile.media.length > 0 ? (
                    <img src={profile.media[0].url} alt={profile.displayName || userName} />
                  ) : (
                    <div className="placeholder-image">{userName.charAt(0)}</div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{profile.displayName || userName}</h3>
                  <p className="category">{profile.category}</p>
                  {profile.bio && <p className="bio">{profile.bio.slice(0, 80)}...</p>}
                  <div className="card-footer">
                    <div className="rating">
                      ⭐ {profile.rating.toFixed(1)} ({profile.jobsCompleted} jobs)
                    </div>
                    <div className="rates">
                      {profile.hourlyRate && <span>${profile.hourlyRate}/hr</span>}
                      {profile.dailyRate && <span>${profile.dailyRate}/day</span>}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {filteredProfiles.length === 0 && (
            <div className="empty-state">No freelancers found</div>
          )}
        </div>
      )}
    </div>
  );
}