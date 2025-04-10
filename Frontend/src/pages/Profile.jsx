import { useAuth } from "../context/AuthContext";
import { Container } from "react-bootstrap";
import DP from "../assets/dp.jpg";
import "../styles/custom.css";
const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-avatar">
            <img src={DP} alt="Profile" />
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-card">
              <div className="info-row">
                <div className="info-label">
                  <i className="name-icon"></i>
                  <span>Name</span>
                </div>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">
                  <i className="email-icon"></i>
                  <span>Email</span>
                </div>
                <div className="info-value">{user.email}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <i className="phone-icon"></i>
                  <span>Phone</span>
                </div>
                <div className="info-value">{user.phoneNumber}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <i className="role-icon"></i>
                  <span>Account Type</span>
                </div>
                <div className="info-value">
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
