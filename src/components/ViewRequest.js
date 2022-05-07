import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

function ViewRequest() {
  const { requestId } = useParams();
  const [request, setRequest] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  useEffect(() => {
    const docRef = doc(db, "FeedbackRequest", requestId);
    updateDoc(docRef, {
      status: 2,
    });
    onSnapshot(docRef, (snapshot) => {
      setRequest({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);

  useEffect(() => {
    if (request.length != 0) {
      const portfolioRef = doc(db, "Portfolio", request.portfolio);
      onSnapshot(portfolioRef, (snapshot) => {
        setPortfolio({ ...snapshot.data(), id: snapshot.id });
      });
    }
  }, [request]);

  return (
    <div>
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
        {request.portfolio}
        <img src={portfolio.imageUrl} alt="image" width="200px" />
        <button>View Portfolio</button>
      </Link>
      <Link to={`/addFeedback/${requestId}`}>
        <button>Start Feedback</button>
      </Link>
      {/* <button
        onClick={() => {
          console.log(portfolio);
        }}
      >
        click me
      </button> */}
    </div>
  );
}

export default ViewRequest;
