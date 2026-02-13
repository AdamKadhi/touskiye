import React, { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default admin credentials (you can change these)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
        onLogin();
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .login-container { min-height: 100vh; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        
        .login-container::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(196, 214, 0, 0.1), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 107, 53, 0.1), transparent 50%); animation: gradientShift 8s ease-in-out infinite; }
        
        @keyframes gradientShift { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        
        .login-card { background: #2a2a2a; border-radius: 24px; padding: 3rem; width: 90%; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(244, 237, 216, 0.1); position: relative; z-index: 1; animation: slideUp 0.5s ease; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        
        .login-header { text-align: center; margin-bottom: 2.5rem; }
        
        .logo-icon { width: 80px; height: 80px; background: linear-gradient(135deg, #c4d600, #ff6b35); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: white; margin: 0 auto 1.5rem; animation: popIn 0.6s ease 0.3s backwards; box-shadow: 0 10px 30px rgba(196, 214, 0, 0.3); }
        
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        
        .login-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: #f4edd8; letter-spacing: 3px; margin-bottom: 0.5rem; }
        
        .login-subtitle { color: #999; font-size: 0.9rem; }
        
        .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .form-label { color: #999; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        
        .form-input { padding: 1rem 1.2rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 12px; color: #f4edd8; font-size: 0.95rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .form-input:focus { outline: none; border-color: #c4d600; box-shadow: 0 0 0 4px rgba(196, 214, 0, 0.1); }
        
        .form-input::placeholder { color: #666; }
        
        .error-message { background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); color: #ff6b35; padding: 0.9rem 1.2rem; border-radius: 10px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; animation: shake 0.5s ease; }
        
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        
        .login-button { padding: 1rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); }
        
        .login-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5); }
        
        .login-button:active:not(:disabled) { transform: translateY(0); }
        
        .login-button:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .back-to-home { text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(244, 237, 216, 0.1); }
        
        .back-link { color: #c4d600; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; }
        
        .back-link:hover { color: #ff6b35; gap: 1rem; }
        
        .credentials-hint { background: rgba(196, 214, 0, 0.05); border: 1px solid rgba(196, 214, 0, 0.2); border-radius: 10px; padding: 1rem; margin-top: 1.5rem; }
        
        .credentials-hint-title { color: #c4d600; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        
        .credentials-hint-text { color: #999; font-size: 0.85rem; line-height: 1.6; }
        
        .credentials-hint-text code { background: #1a1a1a; color: #c4d600; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        
        /* Responsive */
        @media (max-width: 768px) {
          .login-card { padding: 2rem; }
          .login-title { font-size: 1.8rem; }
          .logo-icon { width: 60px; height: 60px; font-size: 2rem; }
        }
      `}</style>

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
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="credentials-hint">
            <div className="credentials-hint-title">🔐 Default Credentials</div>
            <div className="credentials-hint-text">
              Username: <code>admin</code><br />
              Password: <code>admin123</code>
            </div>
          </div>

          <div className="back-to-home">
            <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
              <span>←</span>
              <span>Back to Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}