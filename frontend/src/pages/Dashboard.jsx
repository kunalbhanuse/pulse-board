import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

const formatDate = (value) => {
  if (!value) return "No expiry";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return "Duration set";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [copiedId, setCopiedId] = useState("");
  const API_URL = "http://localhost:3000";
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/poll/dashboard`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setPolls(response.data.data || []);
      } catch (error) {
        setStatus({
          type: "error",
          text: error.response?.data?.error || "Unable to load dashboard.",
        });
      }
    };

    fetchDashboard();
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/logout`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  const handleCopy = async (shareId) => {
    const pollUrl = `${window.location.origin}/poll/${shareId}`;
    await navigator.clipboard.writeText(pollUrl);
    setCopiedId(shareId);
    window.setTimeout(() => setCopiedId(""), 1600);
  };

  const ownerName = polls[0]?.createdBy?.name || "there";
  const activePolls = polls.filter((poll) => {
    const expiry = new Date(poll.expiresAt);
    return Number.isNaN(expiry.getTime()) || expiry > new Date();
  }).length;

  const handleLocalLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-navbar">
        <button className="dashboard-brand" onClick={() => navigate("/")}>
          <span>PB</span>
          PulseBoard
        </button>

        <div className="dashboard-nav-actions">
          <button className="ghost-btn" onClick={() => navigate("/createPoll")}>
            New poll
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="welcome-text">
              Welcome back <span className="username">{ownerName}</span>
            </p>
            <h1>Manage your polls from one place.</h1>
            <p>
              Create feedback links, keep an eye on active polls, and share
              voting pages with a polished public experience.
            </p>
          </div>

          <button className="button button-primary" onClick={() => navigate("/createPoll")}>
            Create New Poll
          </button>
        </section>

        {status.text && (
          <p className={`status-message ${status.type}`}>{status.text}</p>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Polls</span>
            <h3>{polls.length}</h3>
          </div>

          <div className="stat-card">
            <span>Active Polls</span>
            <h3>{activePolls}</h3>
          </div>

          <div className="stat-card">
            <span>Share Links</span>
            <h3>{polls.filter((poll) => poll.shareId).length}</h3>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Your Recent Polls</h2>
            <button className="button button-secondary" onClick={() => navigate("/createPoll")}>
              Create Poll
            </button>
          </div>

          {polls.length === 0 ? (
            <div className="empty-state">
              <h3>No polls yet</h3>
              <p>Create your first poll and start collecting votes.</p>
              <button className="button button-primary" onClick={() => navigate("/createPoll")}>
                Create Poll
              </button>
              {!accessToken && (
                <button className="button button-secondary" onClick={handleLocalLogout}>
                  Login again
                </button>
              )}
            </div>
          ) : (
            <div className="poll-list">
              {polls.map((poll) => (
                <article className="poll-row-card" key={poll._id}>
                  <div>
                    <span className="poll-state">
                      {poll.requiresAuth ? "Authenticated" : "Public"}
                    </span>
                    <h3>{poll.title}</h3>
                    <p>{poll.description}</p>
                    <div className="poll-meta">
                      <span>Created {formatDate(poll.createdAt)}</span>
                      <span>Expires {formatDate(poll.expiresAt)}</span>
                    </div>
                  </div>

                  <div className="poll-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => navigate(`/poll/${poll.shareId}`)}
                    >
                      Open
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => handleCopy(poll.shareId)}
                    >
                      {copiedId === poll.shareId ? "Copied" : "Copy link"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
