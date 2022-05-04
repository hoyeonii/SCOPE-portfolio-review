import { Timestamp, collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import AddPortfolio from "./AddPortfolio";
import PdfToImg from "./helper/PdfToImg";
import UploadProfile from "./UploadProfile";

function AccountInfo() {
  const [user] = useAuthState(auth); //로그인 했는지 확인

  return (
    <div>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <UploadProfile />
          <AddPortfolio />
          {/* <PdfToImg /> */}
        </>
      )}
    </div>
  );
}

export default AccountInfo;
