import React, { useState, useEffect, useRef } from "react";
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
  let topic = ["Summary", "things1", "things2", "things3", "needs1", "needs2"];

  let feedbackData = {
    requestId: requestId,
    portfolio: request.portfolio,
    data: [],
  };
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
          ? [...topic, ...request.selectedTopic, ...selectedTopic]
          : [...topic, ...request.selectedTopic]);
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
    const inputCount = request.selectedTopic.length + selectedTopic.length;
    console.log(inputCount);
    console.log(e);
    console.log(e.target[0].type);

    for (let i = 0; i < 6 + inputCount * 2; i++) {
      console.log(e.target[i].type, i);
      if (e.target[i].type === "file") {
        ////여기 .type를 못읽어오겠대 e.target이 이상한듯
        console.log(e.target[i].files);
        images.push(e.target[i].files[0]);
      }
    }
    const uploadImg = async () => {
      console.log("uploadImg");
      images.map((img, i) => {
        console.log(img);

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
      feedbackData = {
        requestId: requestId,
        portfolio: request.portfolio,
        data: [],
      };
      //앞에 6개 text만 있는 부분
      for (let i = 0; i < 6; i++) {
        console.log(urls);
        console.log(topic);
        console.log(urls.find((url) => url.id === i));

        feedbackData.data.push({
          topic: topic[i],
          text: inputData[i].value,
          image: null,
        });
      }
      //그 뒤 사진과 함께 상세설명 부분
      for (let i = 0; i < inputCount; i++) {
        console.log(urls);
        console.log(topic);
        console.log(urls.find((url) => url.id === i));
        let url = urls.find((url) => url.id === i)
          ? urls.find((url) => url.id === i).url
          : null;
        feedbackData.data.push({
          topic: topic[6 + i],
          text: inputData[6 + i * 2].value,
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

  function AddImage({ topic }) {
    console.log(topic);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [fileValue, setFileValue] = useState("");
    const ref = useRef();
    const handleClick = (e) => {
      e.preventDefault();
      // e.stopPropagation();
      setImgLoaded(false);
      ref.current.value = "";

      var preview = document.getElementById(topic);
      preview.src = "";
    };
    return (
      <div>
        <img id={topic} width="200px" />
        <input
          type="file"
          name={`${topic}Pic`}
          ref={ref}
          onChange={(e) => {
            e.preventDefault();
            // console.log(e.target.files[0]);
            // setImg(e.target.files[0]);
            setImgLoaded(true);
            if (e.target.files.length > 0) {
              var src = URL.createObjectURL(e.target.files[0]);
              var preview = document.getElementById(topic);
              preview.src = src;
            }
          }}
        />
        {imgLoaded && <button onClick={handleClick}>Delete Image</button>}
      </div>
    );
  }
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
            categories of feedback.
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
              }}
            >
              <div>
                <h5>Summary</h5>
                <span>
                  Provide a high-level summary of your feedback, you can get
                  into the details later. (Suggested Length:4-5 sentences)
                </span>
                <input type="text" name="summary" />
                {/* <input type="file" name="summaryPic" /> */}
                {/* <AddImage topic="Summary" /> */}
                <h5>Key Takeaways</h5>
                <span>
                  Tell {request.fromName} the three things you liked most about
                  their portfolio and the two biggest things they can focus on
                  improving now. (Suggested Length: 1 sentence per bullet point)
                </span>
                <h5>Things You Like</h5>
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <h5>Needs Some Work</h5>
                <input type="text" />
                <input type="text" />
              </div>
              {request.selectedTopic &&
                request.selectedTopic.map((topic) => {
                  return (
                    <div>
                      <h5>{topic}</h5>
                      <span>{topicsDescription[topics.indexOf(topic)]}</span>
                      <br />
                      <input type="text" />
                      {/* <input type="file" name={`${topic}Pic`} /> */}
                      <AddImage topic={topic} />
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
                    {/* <input type="file" name={`${topic}Pic`} /> */}
                    <AddImage topic={topic} />
                  </div>
                );
              })}
              <button
                type="submit"
                // onClick={(e) => {
                //   e.preventDefault();
                //   // handleFeedbackSubmit(e);
                //   // setPreviewOn(true);
                // }}
              >
                Preview FeedBack
              </button>
            </form>
          </section>
          <button
            onClick={() => {
              console.log(urls);
              console.log(previewOn);
              console.log(topic);
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
