// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <Link href="/" className="navbar__logo">
          PulseBoard
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">
            Home
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
