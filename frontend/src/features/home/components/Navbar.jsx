import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from '../../auth/hook/useAuth';

// SVG icons
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
);

const Navbar = () => {
  const navigate = useNavigate()
  const logout = async () => {
    await handleLogout();
    navigate("/");
};
  const { user } = useSelector(state => state.auth);
const { handleLogout } = useAuth();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const navLinks = [
  { label: "Home", to: "/" },
  { label: "Buy", href: "/properties" },
  { label: "Sell", to: "/sell-property" },
  { label: "Location", href: "/locations" },
  { label: "Contact", to: "/contact" },
];

  return (
    <>
      <nav className={`lp-navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="lp-navbar__inner">
          {/* Logo */}
          <Link to="/" className="lp-navbar__logo">
            <div className="lp-navbar__logo-icon">
              <IconHome />
            </div>
            <span className="lp-navbar__logo-text">360Views</span>
          </Link>

          {/* Center Links */}
          <ul className="lp-navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link to={link.to}>{link.label}</Link>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="lp-navbar__actions">
            <Link to="/favorites" className="lp-navbar__favorite">
              <FaRegHeart />
            </Link>

            {!user ? (
    <>
        <Link to="/login" className="lp-btn lp-btn--outline">
    Login
</Link>

<Link to="/register" className="lp-btn lp-btn--primary">
    Register
</Link>
    </>
) : user.role === "admin" ? (
    <>
        <Link to="/admin/dashboard" className="lp-btn lp-btn--outline">
    Dashboard
</Link>

<button className="lp-btn lp-btn--primary" onClick={logout}>
    Logout
</button>
    </>
) : (
    <>

<button className="lp-btn lp-btn--primary" onClick={logout}>
    Logout
</button>
    </>
)}
          </div>

          {/* Hamburger */}
          <button
            className={`lp-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {/* Mobile Drawer */}
<div className={`lp-nav-drawer${menuOpen ? ' open' : ''}`}>
  {navLinks.map((link) =>
    link.to ? (
      <Link
        key={link.label}
        to={link.to}
        onClick={() => setMenuOpen(false)}
      >
        {link.label}
      </Link>
    ) : (
      <a
        key={link.label}
        href={link.href}
        onClick={() => setMenuOpen(false)}
      >
        {link.label}
      </a>
    )
  )}

  {/* Favorites */}
  <Link
    to="/favorites"
    onClick={() => setMenuOpen(false)}
  >
    Favorites
  </Link>

  <div className="lp-nav-drawer__actions">

    {!user ? (
      <>
        <Link
          to="/login"
          className="lp-btn lp-btn--outline"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>

        <Link
          to="/register"
          className="lp-btn lp-btn--primary"
          onClick={() => setMenuOpen(false)}
        >
          Register
        </Link>
      </>
    ) : user.role === "admin" ? (
      <>
        <Link
          to="/admin/dashboard"
          className="lp-btn lp-btn--outline"
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>

        <button
          className="lp-btn lp-btn--primary"
          onClick={logout}
        >
          Logout
        </button>
      </>
    ) : (
      <button
        className="lp-btn lp-btn--primary"
        onClick={logout}
      >
        Logout
      </button>
    )}

  </div>
</div>
    </>
  );
};

export default Navbar;
