import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import '../../App.css';
import Header from "../../components/Header";
import useNotifications from "../../hooks/useNotifications";


export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { notifications, setNotifications, addNotification } = useNotifications();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");

      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.access);

      alert("Login successful 🎉!");
      navigate("/users");
    } 
    catch (err:any) {
      console.error("Login error:", err.response?.data);
      setError(
        err.response?.data?.detail ||
        "Invalid username or password"
      );
    }
  };

return (
  <>
    <Header
      notificationCount={notifications.filter((n) => !n.isRead).length}
      notifications={notifications}
      setNotifications={setNotifications}
    />

    <div className="login-wrapper">
      <div className="login-dialog">
        <div className="login-box">
          <div className="login-box-header">
            <h5 className="login-box-title">Login</h5>
          </div>

          <div className="login-box-body">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username *</label>
                <input
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="forgot mb-2">Forgot Password?</div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="login-btn-full">
                Login
              </button>

              <p className="signup">
                Don’t have an account? <a href="/Register">Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
);
}