import React, { useState } from 'react';
import MeetingMinutes from './MeetingMinutes';
import Login from './Login';
import './MeetingMinutes.css';
import './Login.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <MeetingMinutes onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
