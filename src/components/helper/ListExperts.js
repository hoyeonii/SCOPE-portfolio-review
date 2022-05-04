import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import Carousel from "./Carousel";
import "../css/CategorySlider.css";
import "../css/ListExperts.css";

import { Link } from "react-router-dom";
import "../css/Experts.css";
import verifiedMark from "../image/verifiedMark.jpg";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function ListExperts({ byField }) {
  const [profiles, setProfiles] = useState([]);
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
  return (
    <div>
      ListExperts {byField}
      <div className="profileList">
        {!profiles ? (
          <div>no matching experts</div>
        ) : (
          profiles.map((pro) => (
            <div key={pro.id} className="profileList-info">
              <Link to={`/profile/${pro.id}`}>
                <img
                  className="profile-info-img"
                  src={pro.imageUrl}
                  alt="profilePic"
                  height={200}
                />
              </Link>
              <span className="profileList-info-createBy">
                {pro.createBy}
                {pro.expert == true ? (
                  <img src={verifiedMark} alt="verifiedMark" width={15} />
                ) : (
                  ""
                )}
                {/* <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("exper?", pro.expert);
                  }}
                >
                  clickme
                </button> */}
              </span>
              <span className="profileList-info-field">{pro.field}</span>
              <span className="profileList-info-title">{pro.title}</span>
              <button>See detail</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListExperts;
