import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login({ onLogin }) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          username,
          password,
        }
      );

      if (
        response.data ===
        "Invalid Username or Password"
      ) {

        alert("Wrong username or password");
        return;
      }

      const token = response.data;

      const decoded = jwtDecode(token);
      console.log(decoded);

      const role = decoded.role;
      alert("ROLE = " + role);
      alert("AFTER SAVE = " + localStorage.getItem("role"));

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "role",
        role
      );
      alert("AFTER SET = " + role);
      console.log("AFTER SAVE =", localStorage.getItem("role"));

      localStorage.setItem(
        "username",
        username
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      alert("Login Success");

      onLogin(role);

      window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Backend connection failed"
      );

    } finally {

      setLoading(false);
    }
  };

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
          type={
            showPassword
              ? "text"
              : "password"
          }
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
            setShowPassword(
              !showPassword
            )
          }
          style={{
            cursor: "pointer",
            marginBottom: "20px",
            color: "#ffd6e7",
            fontSize: "14px",
          }}
        >
          {
            showPassword
              ? "Hide Password"
              : "Show Password"
          }
        </p>

        <button
          disabled={loading}
          onClick={handleLogin}
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
            opacity: loading
              ? 0.7
              : 1,
          }}
        >
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

      </div>
    </div>
  );
}