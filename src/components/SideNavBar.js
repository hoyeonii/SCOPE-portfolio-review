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
import "./css/SideNavBar.css";

function SideNavBar({ setSignUpModalOn, setSideNavOpen }) {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState({});
  let navigate = useNavigate();
  useEffect(() => {
    if (user) {
      const docRef = doc(db, "Profile", user.uid);

      onSnapshot(docRef, (snapshot) => {
        setProfile({ ...snapshot.data(), id: snapshot.id });
      });
    }
  }, [user]);
  return (
    <div className="sidenavbar">
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

      {user ? (
        <Link to="/">
          <button
            onClick={() => {
              signOut(auth);
            }}
          >
            Log out
          </button>
        </Link>
      ) : (
        <button
          variant="secondary"
          onClick={() => {
            setSignUpModalOn(true);
          }}
        >
          Log In
        </button>
      )}
      <div className="sidenavbar-background"></div>
    </div>
  );
}

export default SideNavBar;
