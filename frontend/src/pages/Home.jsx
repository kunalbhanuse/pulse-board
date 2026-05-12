import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";

const featureCards = [
  {
    title: "Structured poll builder",
    text: "Add questions, answer options, access rules, and expiry timing without losing the simple flow your audience expects.",
  },
  {
    title: "Shareable response links",
    text: "Every poll gets a short public route that can be posted in chat, email, event pages, or internal communities.",
  },
  {
    title: "Owner dashboard",
    text: "Track your polls in one place with clear states, creation dates, quick copy actions, and fast access to new polls.",
  },
  {
    title: "Focused voting experience",
    text: "Respondents get a clean, mobile-friendly page that keeps attention on the questions and choices.",
  },
];

const Home = () => {
  return (
    <main className="home-page">
      <Navbar />
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-eyebrow">Professional polling workspace</p>

          <h1>PulseBoard turns quick questions into clear decisions.</h1>

          <p className="home-description">
            Create branded polls, invite people through a simple link, and keep
            your team aligned with a dashboard designed for fast feedback.
          </p>

          <div className="home-actions">
            <Link to="/signup" className="btn btn-primary">
              Start free
            </Link>

            <Link to="/login" className="btn btn-secondary">
              Sign in
            </Link>
          </div>

          <div className="home-proof" aria-label="Platform metrics">
            <span>
              <strong>4 step</strong> poll setup
            </span>
            <span>
              <strong>Public</strong> voting links
            </span>
            <span>
              <strong>Auth</strong> controls
            </span>
          </div>
        </div>

        <div className="home-preview" aria-label="Product preview">
          <div className="preview-header">
            <div>
              <span>Product roadmap vote</span>
              <small>Audience poll</small>
            </div>
            <span className="status-pill">Live</span>
          </div>

          <div className="preview-question">
            <p>Which improvement should ship first?</p>

            <div className="preview-option">
              <span>Advanced analytics</span>
              <strong>48%</strong>
            </div>

            <div className="preview-option">
              <span>Public templates</span>
              <strong>29%</strong>
            </div>

            <div className="preview-option">
              <span>Export reports</span>
              <strong>17%</strong>
            </div>

            <div className="preview-option">
              <span>Team permissions</span>
              <strong>6%</strong>
            </div>
          </div>

          <div className="preview-footer">
            <span>124 responses</span>
            <span>Closes in 7 days</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="home-eyebrow">Complete workflow</p>
          <h2>Everything your poll needs, from draft to response.</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="home-eyebrow">Ready to begin?</p>
          <h2>Launch your first PulseBoard poll today.</h2>
        </div>

        <Link to="/signup" className="btn btn-primary">
          Create account
        </Link>
      </section>
    </main>
  );
};

export default Home;
