import React, { useState } from 'react';
import './Login.css';
import bgImage from './assets/bg.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
        </div>
        <div className="login-right" style={{ backgroundImage: `url(${bgImage})` }}></div>
      </div>
    </div>
  );
};

export default Login;
