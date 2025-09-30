import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Top Talent for Your Events</h1>
          <p className="hero-subtitle">
            Connect with professional bodyguards, anchors, actors, models, dancers, and more
          </p>
          {!user && (
            <div className="hero-actions">
              <Link to="/register" className="btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/freelancers" className="btn-secondary btn-large">
                Browse Freelancers
              </Link>
            </div>
          )}
          {user && (
            <div className="hero-actions">
              {user.role === 'client' && (
                <Link to="/freelancers" className="btn-primary btn-large">
                  Browse Freelancers
                </Link>
              )}
              <Link to="/jobs" className="btn-secondary btn-large">
                View Jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Browse Profiles</h3>
            <p>Search through our curated list of verified professionals across various categories</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Book Services</h3>
            <p>Select your freelancer, choose hourly or daily rates, and schedule your job</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Make safe payments through our platform and track your job status</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Share your experience and help others find the best professionals</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          <Link to="/freelancers?category=bodyguard" className="category-card">
            <h3>Bodyguards</h3>
            <p>Professional security services</p>
          </Link>
          <Link to="/freelancers?category=anchor" className="category-card">
            <h3>Anchors</h3>
            <p>Event hosts and MCs</p>
          </Link>
          <Link to="/freelancers?category=actor" className="category-card">
            <h3>Actors</h3>
            <p>Professional performers</p>
          </Link>
          <Link to="/freelancers?category=model" className="category-card">
            <h3>Models</h3>
            <p>Fashion and commercial models</p>
          </Link>
          <Link to="/freelancers?category=dancer" className="category-card">
            <h3>Dancers</h3>
            <p>Professional choreographers</p>
          </Link>
          <Link to="/freelancers?category=others" className="category-card">
            <h3>Others</h3>
            <p>More specialized services</p>
          </Link>
        </div>
      </section>

      {!user && (
        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <p>Join our platform today and connect with top professionals</p>
          <div className="cta-actions">
            <Link to="/register" className="btn-primary btn-large">
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}