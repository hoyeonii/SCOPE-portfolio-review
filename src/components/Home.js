import React, { useState, useEffect } from "react";
import CategorySlider from "./helper/CategorySlider";
import Portfolios from "./Portfolios";
import Experts from "./Experts";
import ListExperts from "./helper/ListExperts";
import Carousel from "./helper/Carousel";
import ListPortfolios from "./helper/ListPortfolios";
import "./css/Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [byField, setByField] = useState("All");
  const [viewMode, setViewMode] = useState("trending");
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
    `Game Design`,
    `Photography`,
    `Web`,
    `Web Design`,
    `Illustration`,
    `fashion`,
    `industry design`,
    `i can't`,
    `think of`,
    `more items`,
    `ㅇㅂㅇ`,
    "3",
    "2",
    "1",
    "0",
  ];

  const setting = {
    dragSpeed: 1.25,
    itemWidth: 120,
    itemHeight: 45,
    itemSideOffsets: 5,
  };

  const itemStyle = {
    width: `${setting.itemWidth}px`,
    height: `${setting.itemHeight}px`,
    margin: `0px ${setting.itemSideOffsets}px`,
  };

  return (
    <div>
      Home
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
      {/* <Portfolios /> */}
      <div className="home-portfolio-button">
        {viewMode === "trending" ? (
          <div className="home-portfolio-sortButton">
            <button
              style={{ fontWeight: "600", borderBottom: "2px solid cadetblue" }}
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
              style={{ fontWeight: "600", borderBottom: "2px solid cadetblue" }}
            >
              Latest
            </button>
          </div>
        )}
        <Link to={`/portfolios`}>
          <button className="home-portfolio-viewAll">{`view all >`}</button>
        </Link>
      </div>
      <ListPortfolios byField={byField} numPortfolio={12} viewMode={viewMode} />
      {/* {listPortfolios} */}
      {/* <Experts /> */}
      <ListExperts byField={byField} />
    </div>
  );
}

export default Home;
