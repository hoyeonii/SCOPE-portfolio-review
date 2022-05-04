import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

function ViewRequest() {
  const { requestId } = useParams();
  const [request, setRequest] = useState([]);
  useEffect(() => {
    const docRef = doc(db, "FeedbackRequest", requestId);

    onSnapshot(docRef, (snapshot) => {
      setRequest({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);

  return (
    <div>
      ViewRequest
      <h4>Feedback Request from {request.fromName}</h4>
      <p>{request.message}</p>
      <h4>Feedback Topics</h4>
      <p>
        {request.fromName} has highlighted these topics as their "must have"
        categories of feedback.
      </p>
      {request.selectedTopic &&
        request.selectedTopic.map((topic) => {
          return <label style={{ border: "1px solid red" }}>{topic}</label>;
        })}
      <br />
      <Link to={`/portfolio/${request.portfolio}`}>
        <button>View Portfolio</button>
      </Link>
      <Link to={`/addFeedback/${requestId}`}>
        <button>Start Feedback</button>
      </Link>
      <button
        onClick={() => {
          console.log(request);
        }}
      >
        click me
      </button>
    </div>
  );
}

export default ViewRequest;
