import React from "react";
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebaseConfig";
import { toast } from "react-toastify";
function FeedbackPreview({ data, setPreviewOn }) {
  console.log(data);
  const storeData = (data) => {
    const ref = collection(db, "Feedback");
    console.log(data);
    addDoc(ref, data)
      .then(() => {
        toast("Feedback added successfully", { type: "success" });
      })
      .catch((err) => {
        toast("Error adding Feedback", { type: "error" });
      });
  };
  return (
    <div>
      FeedbackPreview
      {data.portfolio}
      {data.data.map((el) => {
        return (
          <div>
            <h4>{el.topic}</h4>
            <br />
            <p>{el.text}</p>
            {el.image && <img src={el.image} alt="image" width="100px" />}
          </div>
        );
      })}
      <button
        onClick={() => {
          setPreviewOn(false);
        }}
      >
        go back
      </button>
      <button
        onClick={() => {
          storeData(data);
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default FeedbackPreview;
