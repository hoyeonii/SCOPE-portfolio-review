import React, { useState, useEffect } from "react";

import ListExperts from "./helper/ListExperts";
import Carousel from "./helper/Carousel";
import ListPortfolios from "./helper/ListPortfolios";
import "./css/Home.css";
import UploadPortfolioModal from "./UploadPortfolioModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "./../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function Home() {
  const [user] = useAuthState(auth);

  const [byField, setByField] = useState("All");
  const [viewMode, setViewMode] = useState("trending");
  const [signUpModalOn, setSignUpModalOn] = useState(false);

  // const [listPortfolios, setListPortfolios] = useState(<div>durll</div>);

  // useEffect(() => {
  //   setListPortfolios(
  //     <ListPortfolios byField={byField} numPortfolio={3} viewMode={viewMode} />
  //   );
  // }, [viewMode]);

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

  return (
    <div>
      <div className="home-banner">
        <h1>
          Find Your Expert & <br />
          Improve Your Portfolio
        </h1>
        <button
          onClick={() => {
            if (user) {
              setSignUpModalOn(true);
            } else {
              toast("Join us to upload portfolio", { type: "information" });
            }
          }}
        >
          Let's Get Started
        </button>
        <UploadPortfolioModal
          show={signUpModalOn}
          setSignUpModalOn={setSignUpModalOn}
          onHide={() => setSignUpModalOn(false)}
        />
      </div>
      <div className="home-expertsList">
        <h3>Portfolios</h3>
        <span>
          Explore our library of portfolio and help others by giving them
          feedback!
        </span>
        <div className="carousel">
          <Carousel _data={items} {...setting}>
            {items.map((i, _i) => (
              <button
                key={_i}
                className="item"
                style={{
                  ...itemStyle,
                  backgroundColor:
                    byField == i ? "var(--main-dark)" : "var(--gray-light)",
                  color: byField == i ? "white" : "black",
                }}
                onClick={() => {
                  setByField(i);
                }}
              >
                <p>{i}</p>
              </button>
            ))}
          </Carousel>
        </div>
        {/* <Portfolios /> */}
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
          <Link to={`/portfolios`}>
            <button className="home-portfolio-viewAll">{`View all >`}</button>
          </Link>
        </div>
        <ListPortfolios
          byField={byField}
          numPortfolio={12}
          viewMode={viewMode}
        />
      </div>
      <div className="home-expertsList">
        <h3>Experts</h3>
        <span>
          Our community of Experts will give you top industry advice on how to
          make your portfolio stand out!
        </span>
        <ListExperts byField={byField} numExperts={12} />
      </div>
    </div>
  );
}

export default Home;
