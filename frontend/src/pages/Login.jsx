import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, form);
      if (!response.data.success) throw new Error("Login failed");

      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.error || "Unable to login. Check your credentials and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <Navbar />
      <section className="auth-layout">
        <div className="auth-panel">
          <p className="auth-eyebrow">Welcome back</p>
          <h1>Sign in to your PulseBoard workspace.</h1>
          <p>
            Open your dashboard, create new polls, and manage every response
            link from one focused place.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-card__header">
            <h2>Login</h2>
            <span>Secure access</span>
          </div>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {status.text && (
            <p className={`status-message ${status.type}`}>{status.text}</p>
          )}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            New to PulseBoard? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
