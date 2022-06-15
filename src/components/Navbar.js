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
import logo_nav from "./image/logo_nav.JPG";
import SideNavBar from "./SideNavBar";

function Navbar() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(false);
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
    <div
      className="navbar"
      onClick={() => {
        setSideNavOpen(false);
      }}
    >
      <div className="navbar-left">
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="navbar-logo-container"
        >
          <img src={logo_nav} alt="logo" className="navbar-logo" />
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
        <div className="navbar-left-mobileVer">
          {user && (
            <Link to={`/profile/${user.uid}`}>
              <img src={profileImg} alt="img" className="navbar-right-user" />
            </Link>
          )}
          <i
            class="fa-solid fa-bars"
            onClick={(e) => {
              e.stopPropagation();
              setSideNavOpen(!sideNavOpen);
            }}
          ></i>
        </div>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            {/* <i
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
            ></i> */}
            <Link to={`/profile/${user.uid}`}>
              <span>{profile.displayName}</span>
            </Link>
            <Link to={`/profile/${user.uid}`}>
              <img src={profileImg} alt="img" className="navbar-right-user" />
            </Link>
            {/* <Link to="/accountInfo">upload profile</Link> */}

            <button
              onClick={() => {
                signOut(auth);
                navigate("/");
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      {/* <div className="navbar-middle">
        <i
          className="fa-solid fa-magnifying-glass"
          style={{ padding: "30px" }}
        ></i>
        <input className="searchBar" placeholder="Search"></input>
      </div> */}
      <div
        className="navbar-side"
        style={{ display: sideNavOpen ? "flex" : "none" }}
      >
        <SideNavBar
          setSignUpModalOn={setSignUpModalOn}
          setSideNavOpen={setSideNavOpen}
        />
      </div>
    </div>
  );
}

export default Navbar;
