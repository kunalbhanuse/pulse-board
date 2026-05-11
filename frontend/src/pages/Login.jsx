import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, form);
      console.log(response);
      if (!response.data.success) {
        throw alert("error");
      }

      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="container">
        <h1 className="heading">Login</h1>
        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
