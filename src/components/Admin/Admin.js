import React, { useEffect, useState } from 'react';
import './Admin.css';

const Admin = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    const data = {
      username: username,
      email: email,
      password: password
    };

    try {
      const response = await fetch('/api/create-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        const form = document.querySelector('#create_user form');
        form.reset();
        console.log(result.message); // User created successfully
      } else {
        const error = await response.json();
        console.error(error.error); // Display the error message
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  fetch('/api/users')
    .then((response) => response.json())
    .then((data) => {
      const select_item = document.getElementById("all-users");
      select_item.innerHTML = ''; // Clear previous options
      console.log(data);
      for (let i = 0; i < data.users.length; i++) {
        console.log(data.users[i])
        const option_item = document.createElement('option');
        option_item.value = data.users[i];
        option_item.innerText = data.users[i];
        select_item.appendChild(option_item);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  useEffect(() => {
    if (window.UserName === "Echo_admin") {
      console.log(true)
    } else {
      const change_create = document.getElementById("Admin_page");
      change_create.innerHTML = "<h2 style=\"padding-top: 60px;\">You are not admin</h2>";

    }
  })
  return (
    <div id='Admin_page'>
      <h2>CREATE A USER</h2>
      <div id='create_user'>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
            </div>

            <div className="form-group">
              <button type="submit">Create User</button>
            </div>
          </form>
        </div>
      </div>
      {/* <h2>UPDATE A USER</h2>
      <div id='update_user'>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Select-user">Select a user:</label>
              <select id="all-users" name="all-users" placeholder='select a user'>

              </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">New Username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">New Email:</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
            </div>

            <div className="form-group">
              <button type="submit">Create User</button>
            </div>
          </form>
        </div>

      </div> */}
    </div>
  )
}

export default Admin;