import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { Mail, KeyRound, User, Phone } from "lucide-react";
import "../styles/custom.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );
      setSuccess(res.data.message);
      setForm({ name: "", email: "", phoneNumber: "", password: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-container">
        <div className="auth-overlay">
          <h3>Join Our Community</h3>
          <p>
            Manage your tasks efficiently and collaborate with your team
            seamlessly.
          </p>
        </div>
      </div>

      <Container className="auth-form-container">
        <div className="auth-form-content">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>
              Already have an account?{" "}
              <a href="/" className="text-link">
                Sign in
              </a>
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <Form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <div className="input-icon">
                <User size={16} />
              </div>
              <Form.Control
                placeholder="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="modern-input"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Mail size={16} />
              </div>
              <Form.Control
                placeholder="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="modern-input"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Phone size={16} />
              </div>
              <Form.Control
                placeholder="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="modern-input"
                maxLength={11}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <KeyRound size={16} />
              </div>
              <Form.Control
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="modern-input"
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary">
                Create Account
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Register;
