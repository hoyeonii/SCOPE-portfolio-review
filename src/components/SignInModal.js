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
    `UX/UI`,
    `3D`,
    `Game Art`,
    `Photography`,
    `Website Design`,
    `Illustration`,
    `Fashion`,
    `Logo Design`,
    `Video Edit`,
    `Industrial Design`,
    `Storyboards`,
    `Photoshop Editing`,
    "Modeling",
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
      const profileRef = doc(db, "Profile", auth.currentUser.uid);

      onSnapshot(profileRef, (snapshot) => {
        // console.log(snapshot);
        // console.log(snapshot._document);
        if (snapshot._document) {
          toast("You are already registered!", { type: "error" });
        } else {
          //not registered yet
          // alert("You are not registered!");
          const proRef = doc(db, "Profile", auth.currentUser.uid);
          setDoc(proRef, {
            title: title,
            career: career,
            field: field,
            imageUrl:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            createDate: Timestamp.now().toDate(),
            displayName: auth.currentUser.displayName,
            userId: auth.currentUser.uid,
            verifyMe: false,
            expert: false,
            aboutMe: `Hi there! I'm ${auth.currentUser.displayName}.`,
            followers: [],
          });
        }
        // setPortfolio({ ...snapshot.data(), id: snapshot.id });
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
          toast("You are not registered yet", { type: "error" });
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
        } else {
          //not registered yet
          // alert("You are not registered!");
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
            aboutMe: `Hi there! I'm ${res.user.displayName}.`,
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
        //()????????? props??? ????????? onHide ??????+??? ??????????????? ????????? ????????? ???????????? ????????? function?????????
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
            src={logo}
            alt="logo"
            style={{
              width: "50%",
              marginTop: "50%",
            }}
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

              <div
                className="login-register"
                onClick={() => {
                  setPageMode("register");
                }}
                style={{ cursor: "pointer", textDecorationLine: "underline" }}
              >
                You don't have account yet?
              </div>
            </div>
          </div>
        ) : (
          <div className="login">
            <h3>Sign In</h3>
            <div>
              {!signUpWith && (
                <div className="login-continueWith">
                  <label>
                    Name
                    <input
                      type="text"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    ></input>
                  </label>

                  <label>
                    E-mail adress
                    <input
                      type="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    ></input>
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    ></input>
                  </label>
                  <span className="login-or">or</span>
                  <button
                    className="login-google"
                    onClick={() => {
                      setSignUpWith("google");
                    }}
                  >
                    <img
                      src={googleLogo}
                      alt="google"
                      style={{ width: "20px", marginRight: "10px" }}
                    />
                    Continue with Google
                  </button>
                  {/* <button
                onClick={() => {
                  setSignUpWith("facebook");
                }}
              >
                Continue with Facebook
              </button> */}
                </div>
              )}
              <label>Select your field</label>
              <select className="login-field">
                {fields.map((el) => (
                  <option
                    onClick={() => setField(el)}
                    // style={{ backgroundColor: el === field ? "yellow" : "" }}
                  >
                    {el}
                  </option>
                ))}
              </select>

              <label>
                Job title
                <input
                  type="text"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                ></input>
              </label>

              <label>
                Career
                <input
                  type="text"
                  onChange={(e) => {
                    setCareer(e.target.value);
                  }}
                ></input>
              </label>
            </div>

            <button
              className="login-signin"
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
