import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="PulseBoard home">
          <span className="navbar__mark">PB</span>
          <span>PulseBoard</span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">
            Home
          </Link>

          <Link to="/dashboard" className="navbar__link">
            Dashboard
          </Link>

          <Link to="/login" className="navbar__button navbar__button--ghost">
            Login
          </Link>

          <Link to="/signup" className="navbar__button navbar__button--solid">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
