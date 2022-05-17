import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Carousel from "./helper/Carousel";
import "./css/CategorySlider.css";
import ListExperts from "./helper/ListExperts.js";
import { Link, useLocation } from "react-router-dom";
import "./css/Experts.css";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function Experts() {
  // const [user] = useAuthState(auth);
  const [profiles, setProfiles] = useState([]);
  const [byField, setByField] = useState("All");

  useEffect(() => {
    const profileRef = collection(db, "Profile");
    // setByField(filteredField); ////////여기 지워봐ㅏ
    const q =
      byField == "All"
        ? query(
            profileRef,
            where("expert", "==", true)
            // orderBy("createDate", "desc")
          )
        : query(
            profileRef,
            where("expert", "==", true),
            where("field", "==", byField)
          );

    onSnapshot(q, (snapshot) => {
      const profile = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfiles(profile);
      // console.log("sorted by field" + byField);
    });
  }, [byField]);

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
      <div className="header">
        <h3>Experts</h3>
        <span>
          our community of Experts will give you top industry advice on how to
          make your portfolio stand out!
        </span>
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
      <ListExperts byField={byField} />
    </div>
  );
}

export default Experts;
