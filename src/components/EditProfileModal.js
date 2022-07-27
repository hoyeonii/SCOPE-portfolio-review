import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import React from "react";
import { auth } from "./../firebaseConfig";
import { useNavigate } from "react-router-dom";

import EditAccount from "./EditAccount";

function EditProfileModal({ show, onHide }) {
  let navigate = useNavigate();
  const [user] = useAuthState(auth);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <EditAccount onHide={onHide} />
      dfi
    </Modal>
  );
}

export default EditProfileModal;
