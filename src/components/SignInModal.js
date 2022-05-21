import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import React, { useState } from "react";
import { auth, signInWithGoogle, db } from "./../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { faShieldVirus } from "@fortawesome/free-solid-svg-icons";
import { dataURItoByteString } from "react-pdf/dist/umd/shared/utils";
import { Button, Modal } from "react-bootstrap";
import {
  doc,
  query,
  setDoc,
  Timestamp,
  onSnapshot,
  where,
  orderBy,
  addDoc,
  collection,
} from "firebase/firestore";
import googleLogo from "./image/google.png";
import logo from "./image/logo.png";
import logowithtext from "./image/logowithtext.png";
import logowithtext2 from "./image/그림5.png";

function SignInModal({ show, onHide }) {
  let navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [pageMode, setPageMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [career, setCareer] = useState("");
  const [field, setField] = useState("UX/UI");
  const [signUpWith, setSignUpWith] = useState(null);

  const fields = [
    "UX/UI",
    "Photography",
    "Modeling",
    "VFX",
    "Film",
    "Programming",
    "Animation",
    "Illustration",
    "Product Design",
  ];

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
        displayName: name,
      });
      navigate("/");
    } catch (err) {
      toast(err.code, { type: "error" });
    }
  };
  const signInGoogle = () => {
    signInWithGoogle().then((res) => {
      const profileRef = doc(db, "Profile", res.user.uid);
      onSnapshot(profileRef, (snapshot) => {
        if (snapshot._document) {
          // alert("You are already registered!");
        } else {
          //not registered yet
          signOut(auth);
        }
      });
    });
  };

  const signUpGoogle = () => {
    signInWithGoogle().then((res) => {
      // console.log(res);
      // console.log(res.user.uid);

      const profileRef = doc(db, "Profile", res.user.uid);

      onSnapshot(profileRef, (snapshot) => {
        // console.log(snapshot);
        // console.log(snapshot._document);
        if (snapshot._document) {
          alert("You are already registered!");
        } else {
          //not registered yet
          alert("You are not registered!");
          const proRef = doc(db, "Profile", res.user.uid);
          setDoc(proRef, {
            title: title,
            career: career,
            field: field,
            imageUrl: res.user.photoURL,
            createDate: Timestamp.now().toDate(),
            displayName: res.user.displayName,
            userId: res.user.uid,
            verifyMe: false,
            expert: false,
            aboutMe: "",
            followers: [],
          });
        }
        // setPortfolio({ ...snapshot.data(), id: snapshot.id });
      });
    });
  };
  // const signUpGoogle = () => {
  //   signInWithGoogle().then((res) => {
  //     setSignUpWith(true);
  //     console.log(res);
  //     console.log(res.user.uid);
  //     //get registered if data doesn't exists,

  //     const usersRef = db.collection("Profile").doc(res.user.uid);

  //     usersRef.get().then((docSnapshot) => {
  //       if (docSnapshot.exists) {
  //         console.log("already registered!!");
  //         navigate("/");
  //       } else {
  //         console.log("not registered!!");

  //         // usersRef.set({}); // create the document
  //       }
  //     });
  //     // console.log(usersRef);
  //   });
  // };

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
          margin: "5%",
          height: "70vh",
        }}
      >
        <div className="login-logo">
          <img
            src={logowithtext2}
            alt="logo"
            style={{ width: "50%", margin: "50% 0 0 5%" }}
          />
        </div>

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
              <button className="login-signin" onClick={handleLogin}>
                Log In
              </button>
              {/* <div className="login-continueWith"> */}
              <button className="login-google" onClick={signInGoogle}>
                <img
                  src={googleLogo}
                  alt="google"
                  style={{ width: "20px", marginRight: "10px" }}
                />
                Continue with Google
              </button>
              {/* </div> */}

              {/* <div
                className="login-forgotPwd"
                onClick={() => {}}
                style={{ cursor: "pointer", textDecorationLine: "underline" }}
              >
                Did you forget your password?
              </div> */}

              <div
                className="login-register"
                onClick={() => {
                  setPageMode("register");
                }}
                style={{ cursor: "pointer", textDecorationLine: "underline" }}
              >
                You don't have account yet?
              </div>

              {/* <button onClick={onHide}>x</button> */}
            </div>
          </div>
        ) : (
          <div className="login">
            <div>
              {!signUpWith && (
                <div className="login-continueWith">
                  <button
                    onClick={() => {
                      setSignUpWith("google");
                    }}
                  >
                    Continue with Google
                  </button>
                  <button
                    onClick={() => {
                      setSignUpWith("facebook");
                    }}
                  >
                    Continue with Facebook
                  </button>

                  <label>Name</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  ></input>

                  <label>E-mail adress</label>
                  <input
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>

                  <label>Password</label>
                  <input
                    type="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  ></input>
                </div>
              )}

              <label>Select your field</label>
              {fields.map((el) => (
                <label
                  onClick={() => setField(el)}
                  style={{ backgroundColor: el === field ? "yellow" : "" }}
                >
                  {el}
                </label>
              ))}

              <label>Job title</label>
              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></input>

              <label>Career</label>
              <input
                type="text"
                onChange={(e) => {
                  setCareer(e.target.value);
                }}
              ></input>
            </div>

            <button
              onClick={() => {
                if (signUpWith === "google") {
                  signUpGoogle();
                }
                //  else if (signUpWith === "facebook") {
                //   handleSignUp;
                // }
                else {
                  handleSignUp();
                }
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default SignInModal;
