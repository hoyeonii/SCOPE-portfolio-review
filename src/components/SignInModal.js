import { signInWithEmailAndPassword,createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

function SignInModal({ show, onHide }) {
  let navigate = useNavigate();

  const [pageMode, setPageMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      toast(error.code, { type: "error" });
    }
  };
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
    <Modal
      show={show}
      onHide={() => {
        //()붙여서 props로 가져온 onHide 기능+이 페이지에서 필요한 기능도 추가해서 새로운 function만들기
        onHide();
        setPageMode("login");
      }}
      //   backdrop="static"
      //   keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div
        style={{
          display: "flex",
          border: "1px solid white",
          margin: "5% 8%",
          height: "70vh",
        }}
      >
        <div className="login-logo">Logo</div>

        {pageMode === "login" ? (
          <div className="login">
            <h3>Log In</h3>

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
            <div className="login-button">
              <div
                className="login-forgotPwd"
                onClick={() => {}}
                style={{ cursor: "pointer", textDecorationLine: "underline" }}
              >
                Did you forget your password?
              </div>
              <div
                className="login-register"
                onClick={() => {
                  setPageMode("register");
                }}
                style={{ cursor: "pointer" }}
              >
                You don't have account yet?
              </div>
              <button className="login-signin" onClick={handleLogin}>
                Sign IN
              </button>
              {/* <button onClick={onHide}>x</button> */}
            </div>
          </div>
        ) : (
          <div  className="login">
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
        )}
      </div>

    </Modal>
  );
}

export default SignInModal;
