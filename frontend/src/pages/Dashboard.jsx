import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState();
  const API_URL = "http://localhost:3000";
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const featchDashboard = async () => {
      const response = await axios.get(`${API_URL}/api/poll/dashboard`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("dashboard:-", response.data.data[0]);

      setData(response.data.data[0]);
    };
    featchDashboard();
  }, []);
  // logout
  const handleLogout = async () => {
    const response = await axios.get(`${API_URL}/api/auth/logout`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response", response.data);
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-navbar">
        <h2>PollFlow</h2>

        <div className="dashboard-nav-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="welcome-text">
              Welcome back{" "}
              <span className="username">{data?.createdBy.name}</span>{" "}
            </p>
            <h1>Manage your polls from one place.</h1>
            <p>
              Create new polls, share them with people, and check results as
              votes come in.
            </p>
          </div>

          <button onClick={() => navigate("/createPoll")}>
            Create New Poll
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Polls</span>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <span>Active Polls</span>
            <h3>0</h3>
          </div>

          <div className="stat-card">
            <span>Total Votes</span>
            <h3>0</h3>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Your Recent Polls</h2>
            <button onClick={() => navigate("/polls")}>View All</button>
          </div>

          <div className="empty-state">
            <h3>No polls yet</h3>
            <p>Create your first poll and start collecting votes.</p>
            <button onClick={() => navigate("/create-poll")}>
              Create Poll
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
