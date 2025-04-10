import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import AddAdmin from "./pages/AddAdmin";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/add-admin"
          element={user?.role === "admin" ? <AddAdmin /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : user?.role === "user" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
