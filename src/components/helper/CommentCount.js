import React, { useState, useEffect } from "react";
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
import { db } from "../../firebaseConfig";
import verifiedMark from "../image/verifiedMark.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Comment({ id, userId }) {
  const [numofComment, setNumofComments] = useState(0);
  const commentRef = collection(db, "Comments");

  //load Comments
  useEffect(() => {
    const q = query(
      commentRef,
      where("portfolio", "==", id),
      orderBy("createDate", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const res = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNumofComments(res.length);
    });
  }, []);

  return (
    <div>
      {/* <FontAwesomeIcon icon="fa-brands fa-twitter" /> */}
      {/* <i className="fa fa-comment-dots fa-lg" /> */}
      <i
        class="fa-solid fa-comment-dots"
        style={{ padding: "0px 2px 0px 10px" }}
      ></i>
      <span>{numofComment}</span>
    </div>
  );
}

export default Comment;
