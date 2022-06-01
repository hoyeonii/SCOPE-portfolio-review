import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import DeleteArticle from "./DeleteArticle";
import LikeProfile from "./LikeProfile";
import CommentCount from "./CommentCount";
import FeedbackRequestStatus from "./FeedbackRequestStatus";
import "../css/ListPortfolios.css";
import UploadPortfolioModal from "../UploadPortfolioModal";
import upload from "../image/upload.png";

function ListPortfolios({
  byField,
  userId,
  numPortfolio,
  viewMode,
  requests,
  likedBy,
  setPortId,
  curPortId,
}) {
  const [user] = useAuthState(auth);
  const [portfolios, setPortfolios] = useState([]);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const portfolioRef = collection(db, "Portfolio");
    let q;

    if (userId) {
      console.log(11111111);

      //프로필 있을때
      q = query(
        portfolioRef,
        where("userId", "==", userId),
        orderBy("createDate", "desc")
      );
    } else if (byField) {
      console.log(2222222222);
      if (byField == "All") {
        console.log(3333333333);
        q = query(
          portfolioRef,
          orderBy("createDate", "desc"),
          limit(numPortfolio)
        );
      } else {
        //필드 지정했을때
        console.log(44444444);
        // if (curPortId) {
        //   q = query(
        //     portfolioRef,
        //     where("field", "==", byField),
        //     where("id", "!=", curPortId),
        //     orderBy("createDate", "desc"),
        //     limit(numPortfolio)
        //   );
        // } else {
        q = query(
          portfolioRef,
          where("field", "==", byField),
          orderBy("createDate", "desc"),
          limit(numPortfolio)
        );
        // }
      }
    } else if (likedBy) {
      // 프로필 Saved 칸
      console.log(55555555);
      q = query(
        portfolioRef,
        where("likes", "array-contains", likedBy),
        orderBy("createDate", "desc")
      );
    }
    let portfolio;
    if (viewMode !== "trending") {
      onSnapshot(q, (snapshot) => {
        portfolio = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPortfolios(portfolio);
      });
    } else {
      onSnapshot(q, (snapshot) => {
        portfolio = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            return b.likes.length - a.likes.length;
          });
        console.log(portfolio);
        setPortfolios(portfolio);
      });
    }
  }, [byField, viewMode, numPortfolio]);

  return (
    <div className="portfolios-list">
      {portfolios.map((port) => (
        <div key={port.id} className="portfolios">
          <div>
            {/* <Link to={`/portfolio/${port.id}`}> */}
            <div
              className="portfolios-image-container"
              onClick={() => {
                navigate(`/portfolio/${port.id}`);
                setPortId(port.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={port.thumbnail ? port.thumbnail : port.imageUrl}
                alt="title"
                className="portfolios-image"
              />
              <LikeProfile id={port.id} likes={port.likes} />
            </div>
            {/* </Link> */}

            <div className="portfolios-info">
              <div className="portfolios-info-left">
                <img src={port.profileImg} alt="" className="portfolios-pic" />

                <span>{port.createBy}</span>
              </div>
              <div className="portfolios-info-right">
                <LikeProfile id={port.id} likes={port.likes} />

                <CommentCount id={port.id} />

                {/* {user && user.uid === port.userId && (
                      <DeleteArticle id={port.id} imageUrl={port.imageUrl} />
                    )} */}
              </div>
            </div>
          </div>
          {/* {requests && (
              <div className="portfolios-feedback">
                <button
                  onClick={() => {
                    console.log(
                      requests.filter((req) => req.portfolio == port.id)
                    );
                  }}
                >
                  clickme
                </button>

                <FeedbackRequestStatus
                  status={3}
                  requests={requests.filter((req) => req.portfolio == port.id)}
                />
                <FeedbackRequestStatus
                  status={2}
                  requests={requests.filter((req) => req.portfolio == port.id)}
                />
                <FeedbackRequestStatus
                  status={1}
                  requests={requests.filter((req) => req.portfolio == port.id)}
                />
              </div>
            )} */}
        </div>
      ))}

      {user && userId === user.uid && (
        <div
          className="portfolios-image-container"
          style={{ margin: "10px", cursor: "pointer" }}
          onClick={() => {
            setSignUpModalOn(true);
          }}
        >
          <img src={upload} alt="title" className="portfolios-image" />
        </div>
      )}

      <UploadPortfolioModal
        show={signUpModalOn}
        setSignUpModalOn={setSignUpModalOn}
        onHide={() => setSignUpModalOn(false)}
      />
    </div>
  );
}

export default ListPortfolios;
