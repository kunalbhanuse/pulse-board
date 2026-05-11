import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-eyebrow">Polling and feedback platform</p>

          <h1>Create polls, collect responses, and publish results.</h1>

          <p className="home-description">
            Build structured polls with required questions, anonymous or
            authenticated responses, expiry controls, live analytics, and public
            result sharing.
          </p>

          <div className="home-actions">
            <Link to="/register" className="btn btn-primary">
              Get started
            </Link>

            <Link to="/login" className="btn btn-secondary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="home-preview" aria-label="Product preview">
          <div className="preview-header">
            <span>Event Feedback</span>
            <span className="status-pill">Live</span>
          </div>

          <div className="preview-question">
            <p>How was the overall experience?</p>

            <div className="preview-option">
              <span>Excellent</span>
              <strong>48%</strong>
            </div>

            <div className="preview-option">
              <span>Good</span>
              <strong>32%</strong>
            </div>

            <div className="preview-option">
              <span>Average</span>
              <strong>14%</strong>
            </div>

            <div className="preview-option">
              <span>Poor</span>
              <strong>6%</strong>
            </div>
          </div>

          <div className="preview-footer">
            <span>124 responses</span>
            <span>Updates live</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="home-eyebrow">Platform features</p>
          <h2>Everything needed for a complete feedback workflow.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>Flexible poll creation</h3>
            <p>
              Create polls with multiple single-choice questions, required
              fields, options, expiry time, and response mode controls.
            </p>
          </article>

          <article className="feature-card">
            <h3>Public response links</h3>
            <p>
              Share a public poll link with anonymous users, or require
              authentication when responses should be tied to accounts.
            </p>
          </article>

          <article className="feature-card">
            <h3>Live analytics</h3>
            <p>
              View total responses, option counts, question-wise summaries, and
              participation insights with real-time updates.
            </p>
          </article>

          <article className="feature-card">
            <h3>Published results</h3>
            <p>
              Publish final outcomes so anyone visiting the same poll link can
              view the completed response summaries.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="home-eyebrow">Ready to begin?</p>
          <h2>Start by creating your first poll.</h2>
        </div>

        <Link to="/register" className="btn btn-primary">
          Create account
        </Link>
      </section>
    </main>
  );
};

export default Home;
