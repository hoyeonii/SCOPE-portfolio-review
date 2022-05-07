import React from "react";
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { storage, db } from "../firebaseConfig";
import { toast } from "react-toastify";
function FeedbackPreview({ data, setPreviewOn }) {
  console.log(data);
  const storeData = (data) => {
    const ref = collection(db, "Feedback");
    addDoc(ref, data)
      .then(() => {
        toast("Feedback added successfully", { type: "success" });
      })
      .catch((err) => {
        toast("Error adding Feedback", { type: "error" });
      });

    //change status of request
    const requestRef = doc(db, "FeedbackRequest", data.requestId);
    updateDoc(requestRef, {
      status: 3,
    });
  };
  return (
    <div>
      FeedbackPreview
      {data.portfolio}
      {data.data &&
        data.data.map((el) => {
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
