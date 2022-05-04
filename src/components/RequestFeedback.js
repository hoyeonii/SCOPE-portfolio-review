import React, { useEffect, useState } from "react";
import { dataURItoByteString } from "react-pdf/dist/umd/shared/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

function RequestFeedback() {
  const { id } = useParams(); //Link 통해서 params 전달할때만
  const [user] = useAuthState(auth);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  let navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [requestPortfolio, setRequestPortfolio] = useState("");

  console.log(user);

  const topics = [
    "Layout",
    "Visual",
    "Storytelling",
    "Imagery",
    "Portfolio Medium",
    "Content",
    "Grammar / Writing",
    "Home Page",
    "Project Selection",
  ];

  useEffect(() => {
    const portfolioRef = collection(db, "Portfolio");
    let q = query(
      portfolioRef,
      where("userId", "==", user.uid),
      orderBy("createDate", "desc")
    );
    onSnapshot(q, (snapshot) => {
      let portfolio = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(portfolio);
      setPortfolios(portfolio);
    });
  }, []);

  const handleTopicSelected = (topic) => {
    const copySelectedTopic = [...selectedTopic];

    if (selectedTopic.includes(topic)) {
      const removeIndex = copySelectedTopic.indexOf(topic);
      copySelectedTopic.splice(removeIndex, 1);
      setSelectedTopic(copySelectedTopic);
    } else {
      if (selectedTopic.length === 5) {
        alert("You can choose up to five topics");
        return;
      }
      copySelectedTopic.push(topic);
      setSelectedTopic(copySelectedTopic);
    }
  };

  const sendRequest = () => {
    const requestRef = collection(db, "FeedbackRequest");
    addDoc(requestRef, {
      from: user.uid,
      fromName: user.displayName,
      to: id,
      status: 1,
      selectedTopic: selectedTopic,
      message: message,
      portfolio: requestPortfolio,
    });
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      <h4>Feedback Request</h4>
      <span>
        It helps Experts to provide the best feedback when you give them as many
        specifics about what you want to achieve
      </span>
      <input
        type="text"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      ></input>
      <br />
      <h4>Feedback Topics</h4>
      <span>
        Choose up to five topics that you consider essential to receive
        feedback.
      </span>
      <div>
        {topics.map((topic) => {
          return (
            <button
              onClick={() => {
                handleTopicSelected(topic);
              }}
              style={{
                backgroundColor: selectedTopic.includes(topic) ? "red" : "",
              }}
            >
              {topic}
            </button>
          );
        })}
        {selectedTopic.map((topic) => (
          <div>{topic}</div>
        ))}
        <br />
        {message}
        <br />
        from: {user.uid}
        <br />
        to: {id}
        <br />
        requestPortfolio:{requestPortfolio}
        <br />
        {portfolios.map((port) => {
          return (
            <div
              style={{
                border: "1px solid red",
                backgroundColor: port.id === requestPortfolio ? "yellow" : "",
              }}
              onClick={() => {
                setRequestPortfolio(port.id);
              }}
            >
              {port.id}
              <img src={port.imageUrl} alt="thumbnail" width="100px" />
            </div>
          );
        })}
      </div>
      <button onClick={sendRequest}>Send Feedback Request</button>
    </div>
  );
}

export default RequestFeedback;
