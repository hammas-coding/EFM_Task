import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Form } from "react-bootstrap";
import { Info, Mail, KeyRound } from "lucide-react";
import "../styles/custom.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (res.data.user.role !== "admin") {
        setError("Access denied. Not an admin account.");
        return;
      }

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="auth-image-container">
        <div className="auth-overlay admin-overlay">
          <h3>Admin Portal</h3>
          <p>Access the administrative dashboard to manage users and tasks.</p>
        </div>
      </div>

      <Container className="auth-form-container">
        <div className="auth-form-content">
          <div className="auth-header">
            <div className="admin-badge">
              <i className="shield-icon"></i>
              <span>Admin Only</span>
            </div>
            <h2>Admin Sign In</h2>
            <p>
              Regular user?{" "}
              <Link to="/" className="text-link">
                User Login
              </Link>
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <Form onSubmit={handleSubmit} className="modern-form admin-form">
            <div className="input-group">
              <div className="input-icon">
                <Mail size={16} />
              </div>
              <Form.Control
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <KeyRound size={16} />
              </div>
              <Form.Control
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            <div className="verification-note">
              <Info size={16} style={{ marginRight: 10 }} />
              <span>
                Only authorized administrators can access this portal.
              </span>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary admin-btn">
                Access Admin Portal
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default AdminLogin;
