import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          FreelanceHub
        </Link>

        <div className="nav-menu">
          <Link to="/freelancers" className="nav-link">
            Browse Freelancers
          </Link>

          {user && (
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">
                {user.name} <span className="user-role">({user.role})</span>
              </span>
              <button onClick={logout} className="btn-secondary btn-small">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary btn-small">
                Log In
              </Link>
              <Link to="/register" className="btn-primary btn-small">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}