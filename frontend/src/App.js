import './App.css';

function App() {
  return (
    <div className="app">
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-dot" />
            <span>UrbanEase</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#impact">Impact</a>
          </div>
          <button className="btn btn-ghost">Admin Login</button>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Community issue reporting</p>
            <h1>Report problems. Rally neighbors. Fix faster.</h1>
            <p className="subtext">
              UrbanEase helps residents report broken roads, safety problems, and utility issues
              with photos and locations. Staff track progress while admins coordinate resolutions.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Create Report</button>
              <button className="btn btn-light">Browse Public Reports</button>
            </div>
            <div className="hero-metrics">
              <div>
                <h3>2.4k+</h3>
                <p>Issues reported</p>
              </div>
              <div>
                <h3>74%</h3>
                <p>Resolved within 7 days</p>
              </div>
              <div>
                <h3>320+</h3>
                <p>Active staff & admins</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <div>
                <h4>New Issue</h4>
                <p>Broken streetlight - Block C</p>
              </div>
              <span className="pill pending">Pending</span>
            </div>
            <div className="card-body">
              <div className="detail">
                <span>Location</span>
                <strong>Sector 14, Main Road</strong>
              </div>
              <div className="detail">
                <span>Visibility</span>
                <strong>Public</strong>
              </div>
              <div className="detail">
                <span>Support</span>
                <strong>18 upvotes • 6 comments</strong>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-outline">Update Status</button>
              <button className="btn btn-primary">Notify Residents</button>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="section">
        <h2>Everything you need to move issues forward</h2>
        <div className="grid">
          <div className="feature">
            <h3>Smart reporting</h3>
            <p>Capture details, photos, and precise locations in seconds.</p>
          </div>
          <div className="feature">
            <h3>Public & private cases</h3>
            <p>Let the community collaborate or keep sensitive reports private.</p>
          </div>
          <div className="feature">
            <h3>Status tracking</h3>
            <p>Staff update progress with clear stages and timestamps.</p>
          </div>
          <div className="feature">
            <h3>Engagement tools</h3>
            <p>Upvotes, comments, and support badges drive momentum.</p>
          </div>
          <div className="feature">
            <h3>Admin dashboard</h3>
            <p>Assign tasks, monitor SLAs, and coordinate teams quickly.</p>
          </div>
          <div className="feature">
            <h3>Notifications</h3>
            <p>Residents stay informed with automatic updates.</p>
          </div>
        </div>
      </section>

      <section id="workflow" className="section alt">
        <h2>How UrbanEase works</h2>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Residents submit a report with photos and location.</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Staff review, categorize, and assign the case.</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Admins track progress and update status publicly.</p>
          </div>
          <div className="step">
            <span>4</span>
            <p>Residents receive notifications until resolution.</p>
          </div>
        </div>
      </section>

      <section id="impact" className="section">
        <div className="cta">
          <div>
            <h2>Ready to improve your neighborhood?</h2>
            <p>Launch UrbanEase in your community and start resolving issues faster.</p>
          </div>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </section>
    </div>
  );
}

export default App;
