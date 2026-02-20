import { useState } from 'react'
import './App.css'
import { useAuth } from "./context/AuthContext";
import { useNavigate } from 'react-router-dom'

function LoginForm({loginUrl}) {
  const [username, setUsername] = useState("");
  const { login, username: loggedInUsername } = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // alert("Login successful.  access token = " + data.access_token);
        login(username, data.access_token);
        navigate('/');
      } else if (response.status === 401) {
        alert("Login failed: Invalid username or password");
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  }

  return (
    <form onSubmit={(e) => {handleLogin(e)}}>
      Username:
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br/>
      Password:
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br/>
      <button type="submit">Login</button>
      {loggedInUsername && <p>User {loggedInUsername} is already logged in.</p>}
    </form>
  );
}

export default LoginForm;
