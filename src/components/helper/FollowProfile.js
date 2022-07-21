import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseConfig";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function FollowProfile({ id, followers }) {
  const [user] = useAuthState(auth); //로그인 했는지 확인
  // const [followersCount, setFollowersCount] = useState(followers.length); //followers.length
  const [following, setFollowing] = useState(
    user && followers?.includes(user.uid) ? true : false
  );

  const followersRef = doc(db, "Profile", id);

  const handleFollow = () => {
    if (following) {
      updateDoc(followersRef, {
        followers: arrayRemove(user.uid),
      })
        .then(() => {
          alert("unFollowed");
          setFollowing(false);
          // setFollowersCount(followers.length - 1);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      updateDoc(followersRef, {
        followers: arrayUnion(user.uid),
      })
        .then(() => {
          alert("Followed");
          setFollowing(true);
          // setFollowersCount(followers.length + 1);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    user && (
      <button className="followBtn" onClick={handleFollow}>
        {following ? "Unfollow" : "Follow"}
      </button>
    )
  );
}

export default FollowProfile;
