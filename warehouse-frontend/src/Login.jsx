import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] =
    useState(false);
    const [username, setUsername] =
  useState("");

const [password, setPassword] =
  useState("");


  <button
  disabled={loading}
  onClick={() => {

    setLoading(true);

    axios
      .post(
        "https://skyhavenbackend.onrender.com/auth/login",
        {
          username,
          password,
        }
      )
      .then((response) => {

        const token = response.data;
        const decoded = jwtDecode(token);

        const role =
          decoded.role || decoded.roles;

        localStorage.setItem(
          "role",
          role
        );

        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        localStorage.setItem(
          "role",
          role
        );

        localStorage.setItem(
          "username",
          username
        );

        window.location.href = "/";
      })
      .catch(() => {
        alert("Invalid credentials");
      })
      .finally(() => {
        setLoading(false);
      });
  }}
  style={{
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: loading
      ? "#777"
      : "hotpink",
    color: "white",
    fontSize: "16px",
    cursor: loading
      ? "not-allowed"
      : "pointer",
    opacity: loading ? 0.7 : 1,
  }}
>
  {loading
    ? "Logging in..."
    : "Login"}
</button>  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "35px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "25px",
            color: "#ffd6e7",
            textAlign: "center",
          }}
        >
          SkyHaven Warehouse Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
onChange={(e) =>
  setUsername(e.target.value)
}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "16px",
            borderRadius: "14px",
            border: "none",
            outline: "none",
          }}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
onChange={(e) =>
  setPassword(e.target.value)
}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "14px",
            border: "none",
            outline: "none",
          }}
        />
        <p
  onClick={() =>
    setShowPassword(!showPassword)
  }
  style={{
    cursor: "pointer",
    marginBottom: "20px",
    color: "#ffd6e7",
    fontSize: "14px",
  }}
>
  {showPassword
    ? "Hide Password"
    : "Show Password"}
</p>
        

       <button
  disabled={loading}
  onClick={() => {

    setLoading(true);

    axios
      .post(
        "https://skyhavenbackend.onrender.com/auth/login",
        {
          username,
          password,
        }
      )
      .then((response) => {

        const token = response.data;
        const decoded = jwtDecode(token);

        const role =
          decoded.role || decoded.roles;

        localStorage.setItem(
          "role",
          role
        );

        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        localStorage.setItem(
          "role",
          role
        );

        localStorage.setItem(
          "username",
          username
        );

        window.location.href = "/";
      })
      .catch(() => {
        alert("Invalid credentials");
      })
      .finally(() => {
        setLoading(false);
      });
  }}
  style={{
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: loading
      ? "#777"
      : "hotpink",
    color: "white",
    fontSize: "16px",
    cursor: loading
      ? "not-allowed"
      : "pointer",
    opacity: loading ? 0.7 : 1,
  }}
>
  {loading
    ? "Logging in..."
    : "Login"}
</button>
      </div>
    </div>
  );
}