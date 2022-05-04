import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import FollowProfile from "./helper/FollowProfile";
import "./css/Profile.css";
import ListPortfolios from "./helper/ListPortfolios";
import RequestFeedback from "./RequestFeedback";

function Profile() {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  //   const [profilePic, setprofilePic] = useState("");
  //   const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [requestList, setRequestList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const docRef = doc(db, "Profile", id);

    onSnapshot(docRef, (snapshot) => {
      setProfile({ ...snapshot.data(), id: snapshot.id });
      //   setprofilePic(profile.imageUrl);
      //   setUserId(profile.userId);
      setFollowers(profile.followers);
    });

    //Review Request 가져오기
    const requestRef = collection(db, "FeedbackRequest");
    const q = query(
      requestRef,
      where("to", "==", id) //
    );

    onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequestList(requests);
    });

    // ///포트폴리오 가져오기
    // const portfolioRef = collection(db, "Portfolio");
    // // setByField(filteredField); ////////여기 지워봐ㅏ
    // const q = query(
    //   portfolioRef,
    //   where("userId", "==", userId) //
    //   // orderBy("createDate", "desc")
    // );

    // onSnapshot(q, (snapshot) => {
    //   const profile = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   setPortfolios(profile);
    // });
  }, [profile]);

  useEffect(() => {
    const profileRef = collection(db, "Profile");
    const q = query(
      profileRef,
      where("followers", "array-contains", id),
      orderBy("createDate", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const followingList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowing(followingList);
    });
  }, []);

  return (
    <div className="profile">
      <section className="profile-left">
        <div className="profile-info">
          <img
            src={profile.imageUrl}
            alt="profilePic"
            className="profile-info-img"
          />
          <span className="profile-info-createBy"> {profile.createBy}</span>
          <span className="profile-info-field">{profile.field}</span>
          <span className="profile-info-title">{profile.title}</span>

          <button>CV</button>
          <Link to={`/requestFeedback/${id}`}>
            <button
            // onClick={() => {
            //   navigate("/requestFeedback", { requestToId: 5 });
            // }}
            >
              request feedback
            </button>
          </Link>
          {user && id == user.uid ? (
            <button
              onClick={() => {
                navigate("/EditAccount");
              }}
            >
              Edit Profile
            </button>
          ) : (
            // (
            //   <button
            //     onClick={() => {
            //       console.log(followers);
            //     }}
            //   >
            //     cliske me{" "}
            //   </button>
            // )
            followers && <FollowProfile id={id} followers={followers} />
          )}
        </div>

        <div className="profile-follow">
          {/* <button
            onClick={() => {
              console.log(followers);
              console.log(following);
            }}
          >
            followers
          </button> */}

          <div>
            <div>{following.length}</div>
            <div>following</div>
          </div>
          <span>|</span>
          <div>
            <div>{followers && followers.length}</div>
            <div>follower</div>
          </div>

          {/* //팔로우 버튼 */}
          {/* {followers && ( //이렇게 데이터를 먼저 받아와서 진행해야하는 경우 &&를 사용해서 데이터가 로딩 됐는지 먼저 확인하기!!
              <FollowProfile id={id} followers={followers} />
            )} */}
        </div>
        <div className="profile-portfolio">
          <button>Portfolio</button>

          <button>FeedBack</button>
        </div>

        {/* <div>followers: {followers.followers.length}</div> */}
      </section>
      <section className="profile-right">
        <ListPortfolios byField={"All"} userId={id} />

        <div>
          Feedback Request List
          {requestList.map((request) => {
            return (
              <Link to={`/request/${request.id}`}>
                <div>{request.id}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Profile;
