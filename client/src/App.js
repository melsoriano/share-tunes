import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
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

  // useEffect(() => {
  //   fetchMyAPI();
  // }, []);

  return (
    <div className="App">
      <a href="http://localhost:8080/api/auth/spotify">Login with Spotify</a>
    </div>
  );
}

export default App;
