import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseConfig";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function LikeProfile({ id, likes }) {
  const [user] = useAuthState(auth); //로그인 했는지 확인
  const [likesCount, setLikesCount] = useState(likes.length);

  const likesRef = doc(db, "Portfolio", id);
  const handleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (likes?.includes(user.uid)) {
      updateDoc(likesRef, {
        likes: arrayRemove(user.uid),
      })
        .then(() => {
          setLikesCount(likes.length - 1);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      updateDoc(likesRef, {
        likes: arrayUnion(user.uid),
      })
        .then(() => {
          setLikesCount(likes.length + 1);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="likeProfile">
      <span className="likeText">Like </span>
      {user ? (
        <i
          className={`fa-solid fa-heart`}
          style={{
            cursor: "pointer",
            color: likes?.includes(user.uid) ? "red" : "gray",
            padding: "0px 2px",
            // textShadow: "0px 0px 2px white",
            WebkitTextStroke: "1px white",
          }}
          onClick={handleLike}
        ></i>
      ) : (
        <i
          className={`fa-solid fa-heart`}
          style={{
            color: "red",
            padding: "0px 2px",
            WebkitTextStroke: "1px white",
          }}
        />
      )}
      <span className="likesCount">{likesCount}</span>
    </div>
  );
}

export default LikeProfile;
