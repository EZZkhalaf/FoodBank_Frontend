import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data is in localStorage on page load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user state if data is found
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // Clear user state after logout
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page!</h1>
      {user ? (
        <>
          <p>Hello, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  );
};

export default HomePage;
