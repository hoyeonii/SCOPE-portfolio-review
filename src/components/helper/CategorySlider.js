import React from "react";
import Carousel from "./Carousel";
import "../css/CategorySlider.css";

function CategorySlider() {
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
