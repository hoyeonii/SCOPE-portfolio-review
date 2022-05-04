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
import { storage, db } from "../firebaseConfig";

function AddFeedback() {
  const { requestId } = useParams();
  const [request, setRequest] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  useEffect(() => {
    const docRef = doc(db, "FeedbackRequest", requestId);

    onSnapshot(docRef, (snapshot) => {
      setRequest({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);
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
  const topicsDescription = [
    "Layout Description ",
    "Visual Description",
    "Storytelling Description",
    "Imagery Description",
    "Portfolio Medium Description",
    "Content Description",
    "Grammar / Writing Description",
    "Home Page Description",
    "Project Selection Description",
  ];
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

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const storageRef = firebase
      .storage()
      .ref()
      .child(`feedback/` + e.target.summaryPic.files[0].name);
    const uploadTask = storageRef.put(e.target.summaryPic.files[0]);

    console.log(e.target.summary.value);
    console.log(e.target.summaryPic.files[0].name);
  };
  return (
    <div>
      AddFeedback {requestId}
      <h4>Feedback Template </h4>
      <span>
        {request.fromName} has highlighted these topics as their "must have"
        categories of feedback.{" "}
      </span>
      <br />
      {request.selectedTopic &&
        request.selectedTopic.map((topic) => {
          return (
            <label
              style={{
                border: "1px solid red",
                backgroundColor: "red",
              }}
            >
              {topic}
            </label>
          );
        })}
      <div>
        {request.fromName} has already chosen these topics as their "must have"
        categories of feedback.
      </div>
      {request.selectedTopic &&
        topics
          .filter((topic) => !request.selectedTopic.includes(topic))
          .map((topic) => {
            return (
              <label
                onClick={() => {
                  handleTopicSelected(topic);
                }}
                style={{
                  backgroundColor: selectedTopic.includes(topic) ? "red" : "",
                  border: "1px solid red",
                }}
              >
                {topic}
              </label>
            );
          })}
      <section>
        <form onSubmit={handleFeedbackSubmit}>
          <div>
            <h5>Summary</h5>
            <span>
              Provide a high-level summary of your feedback, you can get into
              the details later. (Suggested Length:4-5 sentences)
            </span>
            <input type="text" name="summary" />
            <input type="file" name="summaryPic" />
          </div>
          {request.selectedTopic &&
            request.selectedTopic.map((topic) => {
              return (
                <div>
                  <h5>{topic}</h5>
                  <span>{topicsDescription[topics.indexOf(topic)]}</span>
                  <br />
                  <input type="text" name={topic} />
                  <input type="file" name={`${topic}Pic`} />
                </div>
              );
            })}
          {selectedTopic.map((topic) => {
            return (
              <div>
                <h5>{topic}</h5>
                <span>{topicsDescription[topics.indexOf(topic)]}</span>
                <br />
                <input type="text" />
              </div>
            );
          })}
          <button type="submit">Preview FeedBack</button>
        </form>
      </section>
    </div>
  );
}

export default AddFeedback;
