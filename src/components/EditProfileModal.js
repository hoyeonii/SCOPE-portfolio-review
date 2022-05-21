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
import EditAccount from "./EditAccount";

function EditProfileModal({ show, onHide, setSignUpModalOn }) {
  let navigate = useNavigate();
  const [user] = useAuthState(auth);

  return (
    <Modal
      show={show}
      onHide={() => {
        //()붙여서 props로 가져온 onHide 기능+이 페이지에서 필요한 기능도 추가해서 새로운 function만들기
        onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <EditAccount setSignUpModalOn={setSignUpModalOn} />
    </Modal>
  );
}

export default EditProfileModal;
