import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import FeedbackPreview from "./FeedbackPreview";

function AddFeedback() {
  const { requestId } = useParams();
  const [request, setRequest] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [previewOn, setPreviewOn] = useState(false);
  const [passData, setPassData] = useState({});
  let topic = [];

  let feedbackData = { portfolio: request.portfolio, data: [] };
  const urls = [];

  useEffect(() => {
    const docRef = doc(db, "FeedbackRequest", requestId);

    onSnapshot(docRef, (snapshot) => {
      setRequest({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);
  useEffect(() => {
    request.selectedTopic &&
      (topic =
        selectedTopic.length > 0
          ? ["Summary", ...request.selectedTopic, ...selectedTopic]
          : ["Summary", ...request.selectedTopic]);
  }, [request, selectedTopic]);
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
  const images = [];
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    let inputData = e.target;
    const inputCount = 1 + request.selectedTopic.length + selectedTopic.length;

    for (let i = 0; i < inputCount * 2; i++) {
      if (e.target[i].type === "file") {
        images.push(e.target[i].files[0]);
      }
    }
    const uploadImg = async () => {
      images.map((img, i) => {
        if (img) {
          const storageRef = ref(
            storage,
            `/image/${Date.now()}${img.name}` //뭐가 안되면 files를 image로 바꿔야할수도?
          );
          const uploadTask = uploadBytesResumable(storageRef, img);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              console.log("hooo");
            },
            (err) => {
              console.log(err);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  return urls.push({ id: i, url: url });
                })
                .then((res) => {
                  console.log(res);
                  return formData();
                })
                .then(() => {
                  setPreviewOn(true);
                });
              // .then((res) => {
              //   console.log(res);
              //   storeData(res);
              // });
            }
          );
        }
      });
    };
    uploadImg();

    const formData = () => {
      feedbackData = { portfolio: request.portfolio, data: [] };
      for (let i = 0; i < inputCount; i++) {
        console.log(urls);
        console.log(urls.find((url) => url.id === i));
        let url = urls.find((url) => url.id === i)
          ? urls.find((url) => url.id === i).url
          : null;
        feedbackData.data.push({
          topic: topic[i],
          text: inputData[2 * i].value,
          image: url,
        });
      }
      console.log(feedbackData);
      setPassData(feedbackData);
      return feedbackData;
    };

    // uploadImg().then((res) => {
    //   console.log(res);
    //   return formData();
    // });
    // .then((res) => {
    //   console.log(res);
    //   storeData(res);
    // });
  };
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
      {previewOn ? (
        <FeedbackPreview data={passData} setPreviewOn={setPreviewOn} />
      ) : (
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
            {request.fromName} has already chosen these topics as their "must
            have" categories of feedback.
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
                      backgroundColor: selectedTopic.includes(topic)
                        ? "red"
                        : "",
                      border: "1px solid red",
                    }}
                  >
                    {topic}
                  </label>
                );
              })}
          <section>
            setPreviewOn(true);
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFeedbackSubmit(e);
                setPreviewOn(true);
              }}
            >
              <div>
                <h5>Summary</h5>
                <span>
                  Provide a high-level summary of your feedback, you can get
                  into the details later. (Suggested Length:4-5 sentences)
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
                    <input type="file" name={`${topic}Pic`} />
                  </div>
                );
              })}
              <button type="submit">Preview FeedBack</button>
            </form>
          </section>
          <button
            onClick={() => {
              console.log(urls);
              console.log(previewOn);
              // console.log(urlofImages);
            }}
          >
            View urls
          </button>
          <button
            onClick={() => {
              storeData(feedbackData);
              // console.log(urlofImages);
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default AddFeedback;
