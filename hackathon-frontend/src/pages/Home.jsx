import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">CoHive</h1>
          <div className="nav-buttons">
            <button onClick={() => navigate('/login')} className="nav-btn login-btn">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="nav-btn signup-btn">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Living Together, Made Easy</h1>
          <p className="hero-subtitle">
            Coordinate chores, share grocery lists, and keep your household running smoothly
          </p>
          <button onClick={() => navigate('/signup')} className="cta-button">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why CoHive?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3 className="feature-title">Shared Grocery Lists</h3>
            <p className="feature-description">
              Create and manage grocery lists together. Never forget items or buy duplicates again.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Chore Management</h3>
            <p className="feature-description">
              Assign, track, and complete household chores fairly. Everyone knows what needs to be done.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Fair Distribution</h3>
            <p className="feature-description">
              See who's doing what. Keep track of contributions and ensure everyone pitches in.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3 className="feature-title">Smart Reminders</h3>
            <p className="feature-description">
              Get notified about upcoming chores and low grocery items. Stay on top of household tasks.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Your Household</h3>
            <p className="step-description">Sign up and invite your roommates to join</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Add Tasks & Lists</h3>
            <p className="step-description">Set up chores and create shared grocery lists</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Stay Coordinated</h3>
            <p className="step-description">Everyone stays in sync and knows their responsibilities</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to simplify your shared living?</h2>
        <p className="cta-text">Join thousands of roommates already using RoomMate</p>
        <button onClick={() => navigate('/signup')} className="cta-button">
          Start Coordinating Today
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CoHive. Making shared living easier.</p>
      </footer>
    </div>
  );
}

export default Home;