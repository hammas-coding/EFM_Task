import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Form } from "react-bootstrap";
import { Mail, KeyRound } from "lucide-react";
import "../styles/custom.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-container">
        <div className="auth-overlay">
          <h3>Welcome Back</h3>
          <p>Access your workspace and continue where you left off.</p>
        </div>
      </div>

      <Container className="auth-form-container">
        <div className="auth-form-content">
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>
              New to TaskManager?{" "}
              <Link to="/register" className="text-link">
                Create an account
              </Link>
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <Form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <div className="input-icon">
                <Mail size={16} />
              </div>
              <Form.Control
                type="email"
                placeholder="Email Address"
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary">
                Sign In
              </button>
            </div>
          </Form>

          <div className="admin-login-link">
            <Link to="/admin-login" className="text-link admin-link">
              <i className="admin-icon " style={{ marginTop: 5 }}></i> Login as
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
