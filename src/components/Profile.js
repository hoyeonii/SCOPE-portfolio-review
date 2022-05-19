import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import FollowProfile from "./helper/FollowProfile";
import "./css/Profile.css";
import ListPortfolios from "./helper/ListPortfolios";
import RequestFeedback from "./RequestFeedback";
import SignInModal from "./SignInModal";

function Profile() {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  //   const [profilePic, setprofilePic] = useState("");
  //   const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [requestsTome, setRequestsTome] = useState([]);
  const [requestsFromme, setRequestsFromme] = useState([]);
  const [selectedTab, setSelectedTab] = useState("About Me");
  const [signUpModalOn, setSignUpModalOn] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    setFollowers(profile.followers);
  }, [profile]);

  useEffect(() => {
    const docRef = doc(db, "Profile", id);

    onSnapshot(docRef, (snapshot) => {
      setProfile({ ...snapshot.data(), id: snapshot.id });
      setFollowers({ ...snapshot.data(), id: snapshot.id }.followers);
    });

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

    // Request 가져오기
    const requestRef = collection(db, "FeedbackRequest");

    //Review Request 가져오기
    const qTo = query(
      requestRef,
      where("to", "==", id) //
    );

    onSnapshot(qTo, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequestsTome(requests);
    });
    //내가 보낸 Request 가져오기
    const qFrom = query(
      requestRef,
      where("from", "==", id) //
    );
    onSnapshot(qFrom, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequestsFromme(requests);
    });
  }, [id]);

  const tabs = ["About Me", "Portfolio", "Saved"];
  const profileTab = (el) => {
    return (
      <a
        href="#"
        onClick={() => {
          setSelectedTab(el);
        }}
        className="profile-tabs"
        style={{
          borderBottom: selectedTab === el && "5px solid var(--main-dark)",
        }}
      >
        {el}
      </a>
    );
  };

  return (
    <div className="profile">
      <section className="profile-header">
        <div className="profile-info">
          <img
            src={profile.imageUrl}
            alt="profilePic"
            className="profile-info-img"
          />
          <div className="profile-info-detail">
            <span className="profile-info-createBy">{profile.displayName}</span>
            <div>
              <span className="profile-info-field">{profile.field}</span>
            </div>
            <span className="profile-info-title">
              {profile.title} {profile.career}
            </span>
            <div className="profile-follow">
              <div>
                <span>Followers {followers && followers.length}</span>
              </div>
              <span>|</span>
              <div>
                <span>Following {following.length}</span>
              </div>

              {/* //팔로우 버튼 */}
              {/* {followers && ( //이렇게 데이터를 먼저 받아와서 진행해야하는 경우 &&를 사용해서 데이터가 로딩 됐는지 먼저 확인하기!!
                <FollowProfile id={id} followers={followers} />
              )} */}
            </div>
          </div>
        </div>

        <div className="profile-portfolio">
          {user && id == user.uid ? (
            <button
              onClick={() => {
                navigate("/EditAccount");
              }}
            >
              Edit Profile
            </button>
          ) : (
            followers && <FollowProfile id={id} followers={followers} />
          )}
          {/* <button>FeedBack</button> */}
        </div>

        {/* <div>followers: {followers.followers.length}</div> */}
      </section>
      <section className="profile-bottom">
        <div className="profile-tab-container">
          <div className="profile-tab">{tabs.map((el) => profileTab(el))}</div>
        </div>
        {selectedTab === "About Me" && <div>wow</div>}
        {selectedTab === "Portfolio" && (
          <ListPortfolios
            byField={"All"}
            userId={id}
            requests={requestsFromme}
          />
        )}
        {selectedTab === "Saved" && <ListPortfolios likedBy={id} />}
        <SignInModal
          show={signUpModalOn}
          onHide={() => setSignUpModalOn(false)}
        />

        {/* //피드백 요청하기 */}
        {/* <div>
          {profile.expert && (
            <Link to={`/requestFeedback/${id}`}>
              <button>request feedback</button>
            </Link>
          )}
          Feedback Request List
          {requestsTome.map((request) => {
            return (
              <Link to={`/request/${request.id}`}>
                <div>{request.id}</div>
              </Link>
            );
          })}
        </div> */}
      </section>
      {/* <button
        onClick={() => {
          console.log(profile);
          console.log(requestsFromme);
        }}
      >
        click me
      </button> */}
    </div>
  );
}

export default Profile;
