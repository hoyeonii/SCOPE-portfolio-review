import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Login.css";

export default function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      toast(error.code, { type: "error" });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid white",
        margin: "5% 8%",
        height: "70vh",
      }}
    >
      <div className="login-logo">Logo</div>
      <div className="login">
        <h3>Log In</h3>
        {/* <div className="login-email"> */}
        <input
          type="email"
          className="login-email"
          placeholder="e-mail"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        {/* </div> */}

        <input
          type="password"
          className="login-password"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          style={{
            width: "100%",
            border: "none",
            borderBottom: "1px solid gray",
            padding: "10px 0",
            margin: "10px 0",
          }}
        />
        <button className="login-signin" onClick={handleLogin}>
          Log In
        </button>
        <div className="login-button">
          <div
            className="login-forgotPwd"
            onClick={(e) => {
              e.preventDefault();
              console.log("registerr");
            }}
            style={{ cursor: "pointer", textDecorationLine: "underline" }}
          >
            Did you forget your password?
          </div>
          <div
            className="login-register"
            onClick={(e) => {
              e.preventDefault();
              console.log("registerr");
            }}
            style={{ cursor: "pointer" }}
          >
            You don't have account yet?
          </div>
        </div>
      </div>
    </div>
  );
}
