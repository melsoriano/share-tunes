import React, { useState, useEffect } from 'react';

function Login() {
  const [user, setUser] = useState();

  async function fetchMyAPI() {
    await fetch('/api')
      .then(res => {
        return res.json();
      })
      .then(body => {
        setUser(body);
      });
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  return (
    <div className="App">
      <body>
        <div>
          <div id="login">
            <h1>First, authenticate with spotify</h1>
            <a href="http://localhost:8080/api/auth/spotify">Login</a>
          </div>
          <div id="loggedin" />
        </div>
      </body>
    </div>
  );
}

export default Login;
