import React, { useState } from "react";
import { authAPI } from "../services/api";
import "../styles/AdminInterface.css";

export default function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);

      // Save token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Call onLogin callback
      onLogin();
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="admin-interface">
      <div style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="logo-icon">T</div>
              <div className="login-title">ADMIN LOGIN</div>
              <div className="login-subtitle">Access the dashboard</div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="credentials-hint">
              <div className="credentials-hint-title">
                🔐 Default Credentials
              </div>
              <div className="credentials-hint-text">
                Username: <code>admin</code>
                <br />
                Password: <code>admin123</code>
              </div>
            </div>

            <div className="back-to-home">
              <p
                className="back-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                <span>←</span>
                <span>Back to Store</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
