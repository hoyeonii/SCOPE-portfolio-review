import React from "react";
import Carousel from "./Carousel";
import "../css/CategorySlider.css";

function CategorySlider() {
  const items = [
    `UX/UI`,
    `3D`,
    `Game Design`,
    `Photography`,
    `Web Dev`,
    `Web Design`,
    `Illustration`,
    `fashion`,
    `industry design`,
    `i can't`,
    `think of`,
    `anymore items`,
    `ㅇㅂㅇ`,
    "3",
    "2",
    "1",
  ];

  const setting = {
    dragSpeed: 1.25,
    itemWidth: 80,
    itemHeight: 30,
    itemSideOffsets: 15,
  };

  const itemStyle = {
    width: `${setting.itemWidth}px`,
    height: `${setting.itemHeight}px`,
    margin: `0px ${setting.itemSideOffsets}px`,
  };

  return (
    <div className="container">
      <Carousel _data={items} {...setting}>
        {items.map((i, _i) => (
          <button
            key={_i}
            className="item"
            style={{ ...itemStyle }}
            onClick={() => {
              console.log(i);
            }}
          >
            <p>{i}</p>
          </button>
        ))}
      </Carousel>
    </div>
  );
}

export default CategorySlider;
