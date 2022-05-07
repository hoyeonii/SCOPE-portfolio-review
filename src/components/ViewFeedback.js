import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

function ViewFeedback() {
  const { requestId } = useParams();
  const [feedback, setFeedback] = useState();
  useEffect(() => {
    const ref = collection(db, "Feedback");

    const q = query(
      ref,
      where("requestId", "==", requestId) //
    );

    onSnapshot(q, (snapshot) => {
      const feedback = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedback(feedback[0]);
    });
  }, []);
  return (
    <div>
      ViewFeedback {requestId}
      {feedback &&
        feedback.data.map((el) => {
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
          console.log(feedback);
        }}
      >
        click me
      </button>{" "}
    </div>
  );
}

export default ViewFeedback;
