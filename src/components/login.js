import React, { useState, useEffect } from 'react';

function Login() {
  const [user, setUser] = useState({ user: null });

  useEffect(() => {
    fetch('/api/home')
      .then(res => {
        return res.json();
      })
      .then(body => {
        if (body) {
          return setUser(body);
        }
        return setUser(null);
      });
  }, []);

  return (
    <div id="login">
      {!user.data ? (
        <div>
          <h1>First, authenticate with spotify</h1>
          <a href="http://localhost:8080/api/auth/spotify">Login</a>
        </div>
      ) : (
        <div>you are logged in :) </div>
      )}
    </div>
  );
}

export default Login;
