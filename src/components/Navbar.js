import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
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
import { db } from "../firebaseConfig";
import "./css/Navbar.css";
import { useNavigate } from "react-router-dom";
import SignInModal from "./SignInModal";
import logowithtext2 from "./image/그림5.png";

function Navbar() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  let navigate = useNavigate();
  // console.log(user);
  useEffect(() => {
    if (user) {
      const docRef = doc(db, "Profile", user.uid);

      onSnapshot(docRef, (snapshot) => {
        setProfile({ ...snapshot.data(), id: snapshot.id });
        setProfileImg({ ...snapshot.data(), id: snapshot.id }.imageUrl);
      });
    }
  }, [user]);

  // useEffect(() => {
  //   setProfileImg(profile.imageUrl);
  //   console.log(profile);
  // }, [profile]);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="navbar-logo-container"
        >
          <img src={logowithtext2} alt="logo" className="navbar-logo" />
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/portfolios");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          Portfolio
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/experts");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          Expert
        </a>
        {/* <Link to="/">LOGO</Link>
        <Link to="/portfolios">Portfolio</Link>
        <Link to="/experts">Expert</Link> */}
      </div>
      {/* <div className="navbar-middle">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input className="searchBar" placeholder="Search"></input>
      </div> */}

      <div className="navbar-right">
        {user ? (
          <div>
            <i
              className="fa-solid fa-envelope fa-lg"
              style={{
                cursor: "pointer",
                color: "navy",
              }}
            ></i>
            <i
              className="fa-solid fa-bell fa-lg"
              style={{
                cursor: "pointer",
                color: "gold",
              }}
            ></i>

            <Link to={`/profile/${user.uid}`}>
              <img
                src={profileImg}
                alt="img"
                style={{
                  width: "35px",
                  borderRadius: "50%",
                  border: "1px solid gray ",
                }}
              />
            </Link>
            {/* <Link to="/accountInfo">upload profile</Link> */}

            <Link to="/">
              <button
                onClick={() => {
                  signOut(auth);
                }}
              >
                Log out
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {/* <Link to="/login">
              <button
              // onClick={() => {
              //   signOut(auth);
              // }}
              >
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button>register</button>
            </Link> */}
            <button
              variant="secondary"
              onClick={() => {
                setSignUpModalOn(true);
              }}
            >
              Log In
            </button>
            <SignInModal
              show={signUpModalOn}
              onHide={() => setSignUpModalOn(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
