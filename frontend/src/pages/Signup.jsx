import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Navbar from "../components/Navbar";

function Signup() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/auth/register`, form);
      navigate("/login");
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.error || "Unable to create account. Please try again.",
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
          <p className="auth-eyebrow">Create your workspace</p>
          <h1>Build better polls with a professional control room.</h1>
          <p>
            Sign up to draft polls, control access, share public voting pages,
            and organize your feedback from the dashboard.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSignup}>
          <div className="auth-card__header">
            <h2>Sign up</h2>
            <span>Start in seconds</span>
          </div>

          <label>
            Full name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Kunal Bhanuse"
              autoComplete="name"
              required
            />
          </label>

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
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
          </label>

          {status.text && (
            <p className={`status-message ${status.type}`}>{status.text}</p>
          )}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Signup;
