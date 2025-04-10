import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { Trash } from "lucide-react";
import "../styles/custom.css";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers,
      });
      setUsers(res.data);
      setStats((prev) => ({ ...prev, totalUsers: res.data.length }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTasks = async (userId = "") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/admin${
          userId ? `?userId=${userId}` : ""
        }`,
        { headers }
      );
      setTasks(res.data);

      const completed = res.data.filter(
        (task) => task.status === "completed"
      ).length;
      const pending = res.data.filter(
        (task) => task.status === "pending"
      ).length;

      setStats((prev) => ({
        ...prev,
        totalTasks: res.data.length,
        completedTasks: completed,
        pendingTasks: pending,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    fetchTasks(e.target.value);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers,
        });
        fetchUsers();
        fetchTasks();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers,
        });
        fetchTasks(selectedUser);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div className="admin-dashboard-page">
      <Container>
        <div className="page-header">
          <div className="admin-badge">
            <span className="shield-icon"></span>
            Admin Dashboard
          </div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">
            Manage users and tasks from one central location
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon users"></div>
            <div className="stat-count">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed"></div>
            <div className="stat-count">{stats.completedTasks}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending"></div>
            <div className="stat-count">{stats.pendingTasks}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>

        <Row className="mt-4 mb-3">
          <Col md={6}>
            <div className="input-group">
              <div className="input-icon">
                <i className="bi bi-person-fill"></i>
              </div>
              <Form.Select
                className="modern-input"
                value={selectedUser}
                onChange={handleUserChange}
              >
                <option value="">-- Filter Tasks by User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <div className="profile-content">
              <div className="profile-section">
                <h3>All Users</h3>
                <div className="info-card">
                  <div className="table-wrapper">
                    <table className="task-table" responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Phone</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge ${u.role}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>{u.phoneNumber}</td>
                            <td>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteUser(u._id)}
                                disabled={
                                  user._id === u._id || u.role === "admin"
                                }
                                title="Delete User"
                              >
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {users.length === 0 && (
                    <div className="empty-tasks">
                      <div className="empty-icon">
                        <i
                          className="bi bi-people"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <h4>No Users Found</h4>
                      <p>There are no users registered in the system.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="profile-content">
              <div className="profile-section">
                <h3>All Tasks {selectedUser && `(Filtered)`}</h3>
                <div className="info-card">
                  <div className="table-wrapper">
                    <table className="task-table" responsive>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Due</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((t) => (
                          <tr key={t._id}>
                            <td>{t.user?.name}</td>
                            <td className="task-description" title={t.title}>
                              {t.title}
                            </td>
                            <td>
                              <span className={`status-badge ${t.status}`}>
                                {t.status}
                              </span>
                            </td>
                            <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteTask(t._id)}
                                title="Delete Task"
                              >
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tasks.length === 0 && (
                    <div className="empty-tasks">
                      <div className="empty-icon">
                        <i
                          className="bi bi-list-check"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <h4>No Tasks Found</h4>
                      <p>
                        There are no tasks{" "}
                        {selectedUser ? "for this user" : "in the system"}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
