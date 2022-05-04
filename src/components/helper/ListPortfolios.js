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
import { Link } from "react-router-dom";
import DeleteArticle from "./DeleteArticle";
import LikeProfile from "./LikeProfile";
import CommentCount from "./CommentCount";
import "../css/ListPortfolios.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function ListPortfolios({ byField, userId, numPortfolio, viewMode }) {
  const [user] = useAuthState(auth);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const portfolioRef = collection(db, "Portfolio");
    let q;

    console.log(viewMode);
    if (userId) {
      //프로필 있을때
      console.log(1);

      q = query(
        portfolioRef,
        where("userId", "==", userId),
        orderBy("createDate", "desc")
      );
    } else {
      if (byField == "All") {
        console.log(3);

        q = query(
          portfolioRef,
          orderBy("createDate", "desc"),
          limit(numPortfolio)
        );
        // if (viewMode == "trending") {
        //   console.log(2);

        //   q = query(
        //     portfolioRef,
        //     orderBy("likes.length", "desc"),
        //     limit(numPortfolio)
        //   );
        // } else {
        //   console.log(3);

        //   q = query(
        //     portfolioRef,

        //     orderBy("createDate", "desc"),
        //     limit(numPortfolio)
        //   );
        // }
      } else {
        //필드 지정했을때
        console.log(4);
        q = query(
          portfolioRef,
          where("field", "==", byField),
          orderBy("createDate", "desc"),
          limit(numPortfolio)
        );
      }
    }
    let portfolio;
    if (viewMode !== "trending") {
      onSnapshot(q, (snapshot) => {
        portfolio = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(portfolio);
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
  }, [byField, viewMode]);
  return (
    <div className="portfolios-list">
      {/* {viewMode} */}

      {portfolios.length === 0 ? (
        <span>no articles found</span>
      ) : (
        portfolios.map((port) => (
          <div key={port.id} className="portfolios">
            <div>
              <Link to={`/portfolio/${port.id}`}>
                <div className="portfolios-image-container">
                  <img
                    src={port.thumbnail ? port.thumbnail : port.imageUrl}
                    alt="title"
                    className="portfolios-image"
                  />
                </div>
              </Link>

              <div className="portfolios-info">
                <div className="portfolios-info-left">
                  <img
                    src={port.profileImg}
                    alt=""
                    className="portfolios-pic"
                  />

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
          </div>
        ))
      )}
      {userId && (
        <Link to={`/accountInfo`}>
          <div
            className="portfolios-image-container"
            style={{ margin: "10px" }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"
              alt="title"
              className="portfolios-image"
            />
          </div>
        </Link>
      )}
    </div>
  );
}

export default ListPortfolios;
