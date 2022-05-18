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
import { db } from "../firebaseConfig";
import verifiedMark from "./image/verifiedMark.jpg";

import "./css/Comment.css";
import { Placeholder } from "react-bootstrap";

function Comment({ id, pageNumber, userId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  //   const [commentRef, setCommentRef] = useState([]);
  const [profilePic, setProfilePic] = useState(
    "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg"
  );
  const [varified, setVarified] = useState(false);
  const [name, setName] = useState("false");
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
      setComments(res);
    });

    if (userId) {
      const profileRef = doc(db, "Profile", userId);
      onSnapshot(profileRef, (snapshot) => {
        setProfilePic(snapshot.data().imageUrl);
        setVarified(snapshot.data().expert);
        setName(snapshot.data().displayName);
      });
    }
  }, []);
  //   useEffect(() => {
  //     try {
  //       const profileRef = doc(db, "Profile", userId);
  //       onSnapshot(profileRef, (snapshot) => {
  //         setProfile({ ...snapshot.data(), id: snapshot.id });
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     console.log(profile);
  //   }, [comments]);

  const saveComment = (comment, pageNumber) => {
    addDoc(commentRef, {
      portfolio: id,
      createBy: userId,
      profileImg: profilePic,
      comment: comment,
      pageNumber: pageNumber,
      createDate: Timestamp.now().toDate(),
      likes: [],
      varified: varified,
      name: name,
    });
  };
  return (
    <div className="comments-container">
      {userId ? (
        <div className="comments-input">
          <span className="comments-input-header">Leave comment</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveComment(e.target[0].value, pageNumber);
              setText("");
            }}
          >
            {profilePic && (
              <img
                className="comments-input-img"
                src={profilePic}
                alt="profilePic"
              />
            )}
            <div className="comments-input-text-container">
              <input
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setText(e.target.value);
                }}
                placeholder="Leave comment"
                value={text}
                className="comments-input-text"
              />
            </div>
            <input
              type="submit"
              value="Send"
              className="comments-input-sendBtn"
            />
          </form>
        </div>
      ) : (
        <div>Log in to leave comment</div>
      )}
      <div className="comments">
        <span className="comments-count"> Comment {comments.length}</span>
        {comments.length > 0 && (
          <div className="comments-comments">
            {comments
              .filter((comment) => comment.pageNumber == pageNumber)
              .map((comment) => (
                <div className="comment">
                  <div className="comment-info">
                    <img
                      src={comment.profileImg}
                      alt="profilePic"
                      height={25}
                      width={25}
                      style={{
                        borderRadius: "50%",
                        border: "2px solid gray",
                        marginRight: "10px",
                        marginTop: "5px",
                      }}
                    ></img>
                    <div className="comment-name">{comment.name}</div>
                    {comment.varified && (
                      <img
                        src={verifiedMark}
                        alt="verifiedMark"
                        height={15}
                        width={15}
                        style={{ alignSelf: "flex-end", margin: "5px" }}
                      ></img>
                    )}
                  </div>
                  <div className="comment-text">{comment.comment}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
