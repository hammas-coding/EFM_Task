import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Container, Form, Alert } from "react-bootstrap";
import { FaShieldAlt } from "react-icons/fa";
import { Mail, KeyRound, User, Phone } from "lucide-react";
import "../styles/custom.css";

const AddAdmin = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "admin",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/admin-create",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setForm({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "admin",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <div className="admin-badge">
          <span className="shield-icon"></span>
          Admin Panel
        </div>
        <h1 className="page-title">Create New Admin</h1>
        <p className="page-subtitle">
          Add a new administrator account with management privileges
        </p>
      </div>

      <Container className="form-container">
        <div className="profile-content">
          <div className="profile-section">
            <h3>Admin Account Details</h3>

            {message && (
              <Alert
                variant={message.includes("success") ? "success" : "danger"}
                className={
                  message.includes("success") ? "alert-success" : "alert-danger"
                }
              >
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-icon">
                  <User size={16} />
                </div>
                <Form.Control
                  className="modern-input"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <Mail size={16} />
                </div>
                <Form.Control
                  className="modern-input"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <Phone size={16} />
                </div>
                <Form.Control
                  className="modern-input"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  maxLength={11}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <KeyRound size={16} />
                </div>
                <Form.Control
                  className="modern-input"
                  name="password"
                  type="password"
                  placeholder="Secure Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="button-container">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                  style={{ justifyContent: "center" }}
                >
                  <FaShieldAlt />{" "}
                  {loading ? "Creating..." : "Create Admin Account"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AddAdmin;
