import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ClipboardList, Shield, LogOut, User } from "lucide-react";
import "../../styles/custom.css";

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <nav className={`modern-navbar ${isScrolled ? "scrolled" : ""}`}>
      <Container>
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <div className="logo">
                <ClipboardList size={24} color="#4f46e5" />
                <span>TaskManager</span>
              </div>
            </Link>
          </div>

          <div className="navbar-menu-toggle" onClick={toggleMobileMenu}>
            <span
              className={`menu-icon ${mobileMenuOpen ? "open" : ""}`}
            ></span>
          </div>

          <div className={`navbar-items ${mobileMenuOpen ? "open" : ""}`}>
            <ul className="nav-links">
              <li className={isActive("/dashboard") ? "active" : ""}>
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  <ClipboardList size={20} className="nav-icon" />
                  <span>
                    {user.role === "admin" ? "Admin Dashboard" : "My Tasks"}
                  </span>
                </Link>
              </li>

              {user.role === "admin" && (
                <li className={isActive("/add-admin") ? "active" : ""}>
                  <Link to="/add-admin" onClick={closeMobileMenu}>
                    <Shield size={20} className="nav-icon" />
                    <span>Add Admin</span>
                  </Link>
                </li>
              )}

              <li className={isActive("/profile") ? "active" : ""}>
                <Link to="/profile" onClick={closeMobileMenu}>
                  <User size={20} className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>

            <div className="simplified-menu">
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={16} className="logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default NavigationBar;
