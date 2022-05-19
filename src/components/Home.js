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
      <div className="home-expertsList">
        <h4>Portfolios</h4>
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
            <button className="home-portfolio-viewAll">{`view all >`}</button>
          </Link>
        </div>
        <ListPortfolios
          byField={byField}
          numPortfolio={12}
          viewMode={viewMode}
        />
      </div>
      <div className="home-expertsList">
        <h4>Experts</h4>
        <span>
          Our community of Experts will give you top industry advice on how to
          make your portfolio stand out
        </span>
        <ListExperts byField={byField} numExperts={12} />
      </div>
      {/* {listPortfolios} */}
      {/* <Experts /> */}
    </div>
  );
}

export default Home;
