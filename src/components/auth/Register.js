import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: firstName + " " + lastName,
      });
      navigate("/");
    } catch (err) {
      toast(err.code, { type: "error" });
    }
  };
  return (
    <div>
      Register
      <div>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
      </div>
      Register
      <div>
        <label>First Name</label>
        <input
          type="text"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        ></input>
        <label>Last Name</label>
        <input
          type="text"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </div>
      <button onClick={handleSignUp}>Submit</button>
    </div>
  );
}

export default Register;
