import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Container, Form } from "react-bootstrap";
import {
  ClipboardList,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
  AlertCircle,
  CheckSquare,
  Clock,
  List,
} from "lucide-react";
import "../styles/custom.css";

const UserDashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editing, setEditing] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", { headers });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/api/tasks/${editing}`, form, {
        headers,
      });
    } else {
      await axios.post("http://localhost:5000/api/tasks", form, { headers });
    }
    setForm({ title: "", description: "", dueDate: "" });
    setEditing(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers });
      fetchTasks();
    }
  };

  const markComplete = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/tasks/${id}/complete`,
      {},
      { headers }
    );
    fetchTasks();
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-header">
          <h2 className="mb-3">My Tasks Dashboard</h2>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">
                <List size={24} color="#4f46e5" />
              </div>
              <div className="stat-count">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckSquare size={24} color="#10b981" />
              </div>
              <div className="stat-count">{completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} color="#f97316" />
              </div>
              <div className="stat-count">{pendingTasks}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>
              {editing ? <span>Edit Task</span> : <span>Add New Task</span>}
            </h3>
            <Form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <div className="input-icon">
                  <ClipboardList size={18} color="#6b7280" />
                </div>
                <Form.Control
                  name="title"
                  placeholder="Task title"
                  value={form.title}
                  onChange={handleChange}
                  className="modern-input"
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <AlertCircle size={18} color="#6b7280" />
                </div>
                <Form.Control
                  as="textarea"
                  rows={1}
                  name="description"
                  placeholder="Task description"
                  value={form.description}
                  onChange={handleChange}
                  className="modern-input"
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <Calendar size={18} color="#6b7280" />
                </div>
                <Form.Control
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="modern-input"
                  required
                />
              </div>

              <button className="btn-primary" type="submit">
                {editing ? (
                  <>
                    <Edit size={16} className="me-2" />
                    Update Task
                  </>
                ) : (
                  <>
                    <Plus size={16} className="me-2" />
                    Add Task
                  </>
                )}
              </button>

              {editing && (
                <button
                  className="btn-outline mt-2"
                  onClick={() => {
                    setEditing(null);
                    setForm({ title: "", description: "", dueDate: "" });
                  }}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </Form>
          </div>

          <div className="profile-section">
            <h3>Your Tasks</h3>
            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-tasks">
                  <AlertCircle
                    size={48}
                    className="empty-icon"
                    color="#6b7280"
                  />
                  <h4>No Tasks Found</h4>
                  <p className="text-muted">
                    You don't have any tasks yet. Create your first task above!
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table hover className="task-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id}>
                          <td className="fw-medium">{task.title}</td>
                          <td>
                            <div
                              className="task-description"
                              title={
                                task.description || "No description provided"
                              }
                            >
                              {task.description || (
                                <em className="text-muted">No description</em>
                              )}
                            </div>
                          </td>
                          <td>{formatDate(task.dueDate)}</td>
                          <td>
                            <span className={`status-badge ${task.status}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {task.status !== "completed" && (
                                <button
                                  className="action-btn complete-btn"
                                  onClick={() => markComplete(task._id)}
                                  title="Mark as Complete"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button
                                className="action-btn edit-btn"
                                onClick={() => {
                                  setEditing(task._id);
                                  setForm({
                                    title: task.title,
                                    description: task.description || "",
                                    dueDate: task.dueDate.split("T")[0],
                                  });
                                }}
                                title="Edit Task"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(task._id)}
                                title="Delete Task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserDashboard;
