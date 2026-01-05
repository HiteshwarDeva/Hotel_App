import React, { useState, useContext } from "react";
import { useNavigate , Link} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all the input fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      const res = await login(email, password);
      if (res.role === "superadmin") navigate("/superadmin/dashboard");
      else if (res.role === "hoteladmin") navigate("/hoteladmin/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  if (user) return <p>You are already logged in</p>;

  return (
    <div className="login-container">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          required
        />
        <button className="button" type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <br/>
      <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
      </div>
    </div>
  );
}
