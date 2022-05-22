import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import DeleteArticle from "./helper/DeleteArticle";
import LikeProfile from "./helper/LikeProfile";
import CommentCount from "./helper/CommentCount";
import ListPortfolios from "./helper/ListPortfolios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
// import CategorySlider from "./CategorySlider";
import Carousel from "./helper/Carousel";
import "./css/CategorySlider.css";
import { Link } from "react-router-dom";
// import "./css/Portfolios.css";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function Portfolios() {
  const [byField, setByField] = useState("All");
  const [viewMode, setViewMode] = useState("trending");

  //   setByField(filteredField);

  // useEffect(() => {
  //   const portfolioRef = collection(db, "Portfolio");
  //   // setByField(filteredField); ////////여기 지워봐ㅏ
  //   const q =
  //     byField == "All"
  //       ? query(portfolioRef, orderBy("createDate", "desc"))
  //       : query(
  //           portfolioRef,
  //           where("field", "==", byField),
  //           orderBy("createDate", "desc")
  //         );
  //   onSnapshot(q, (snapshot) => {
  //     const portfolio = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setPortfolios(portfolio);
  //     console.log("sorted by field" + byField);
  //   });

  //   viewPortfolio = <ListPortfolios byField={byField} />;
  // }, [byField]);

  //필드 슬라이더

  const items = [
    `UX/UI`,
    `3D`,
    `Game Art`,
    `Photography`,
    `Website Design`,
    `Illustration`,
    `Fashion`,
    `Logo Design`,
    `Video Edit`,
    `Industrial Design`,
    `Storyboards`,
    `Photoshop Editing`,
    "Modeling",
  ];

  const setting = {
    dragSpeed: 1.25,
    itemWidth: 100,
    itemHeight: 40,
    itemSideOffsets: 5,
  };

  const itemStyle = {
    width: `${setting.itemWidth}px`,
    height: `${setting.itemHeight}px`,
    margin: `0px ${setting.itemSideOffsets}px`,
  };
  //pdf thumbnail

  return (
    <div>
      <div className="header">
        <h3>Portfolio</h3>
        <span>Explore other people's portfolios and give them feedback!</span>
      </div>

      <div className="carousel">
        <Carousel _data={items} {...setting}>
          {items.map((i, _i) => (
            <button
              key={_i}
              className="item"
              style={{ ...itemStyle }}
              onClick={() => {
                // filteredField = i;
                setByField(i);
              }}
            >
              <p>{i}</p>
            </button>
          ))}
        </Carousel>
      </div>

      <div className="home-portfolio-button">
        {viewMode === "trending" ? (
          <div className="home-portfolio-sortButton">
            <button
              style={{
                fontWeight: "600",
                borderBottom: "2px solid var(--main-dark)",
              }}
            >
              Trending
            </button>

            <button
              onClick={() => {
                setViewMode("latest");
              }}
            >
              Latest
            </button>
          </div>
        ) : (
          <div className="home-portfolio-sortButton">
            <button
              onClick={() => {
                setViewMode("trending");
              }}
            >
              Trending
            </button>

            <button
              style={{
                fontWeight: "600",
                borderBottom: "2px solid var(--main-dark)",
              }}
            >
              Latest
            </button>
          </div>
        )}
      </div>
      <ListPortfolios byField={byField} viewMode={viewMode} />

      {/* {viewPortfolio} */}
      {/* <div className="portfolio-list">
        {portfolios.length === 0 ? (
          <span>no articles found</span>
        ) : (
          portfolios.map((port) => (
            <div key={port.id} className="portfolio">
              <div className="portfolio-image-container">
                <div>
                  {
                    //PDF 썸네일도 보여지고 싶으면 요거 활성화
                    // port.imageUrl.includes(".pdf") ? (
                    //   <Document
                    //     file={port.imageUrl}
                    //     onLoadSuccess={onDocumentLoadSuccess}
                    //   >
                    //     <Page height={150} pageNumber={pageNumber} />
                    //   </Document>
                    // ) :
                    <Link to={`/portfolio/${port.id}`}>
                      <img
                        src={port.imageUrl}
                        alt="title"
                        className="portfolio-image"
                      />
                    </Link>
                  }
                </div>
              </div>
              <div className="portfolio-info">
                <div className="portfolio-info-left">
                  <img src={port.profileImg} alt="" className="portfolio-pic" />
                  <div className="portfolio-profile">
                    <span>{port.createBy}</span>
                    <span className="portfolio-profile-field">
                      {port.field}
                    </span>
                  </div>
                </div>
                <div className="portfolio-info-right">
                  {user && <LikeProfile id={port.id} likes={port.likes} />}
                  <CommentCount id={port.id} />

                  {user && user.uid === port.userId && (
                    <DeleteArticle id={port.id} imageUrl={port.imageUrl} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div> */}
    </div>
  );
}

export default Portfolios;
