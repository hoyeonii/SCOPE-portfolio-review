import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import Carousel from "./Carousel";
import "../css/CategorySlider.css";
import "../css/ListExperts.css";

import { Link } from "react-router-dom";
import "../css/Experts.css";
import verifiedMark from "../image/verified-orange.png";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function ListExperts({ byField, numExperts }) {
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
      numExperts
        ? setProfiles(profile.slice(0, numExperts))
        : setProfiles(profile);
      // console.log("sorted by field" + byField);
    });
  }, [byField]);
  return (
    <div>
      {/* ListExperts {byField} */}
      <div className="profileList">
        {!profiles ? (
          <div>no matching experts</div>
        ) : (
          profiles.map((pro) => (
            <div key={pro.id} className="profileList-info">
              <Link to={`/profile/${pro.id}`}>
                <div className="profileList-info-imgContainer">
                  <img
                    className="profileList-info-img"
                    src={pro.imageUrl}
                    alt="profilePic"
                    height={200}
                  />{" "}
                  <span className="profileList-info-field">{pro.field}</span>
                </div>
                <div className="profileList-info-detail">
                  <span className="profileList-info-createBy">
                    {pro.createBy || pro.displayName}
                    {pro.expert == true ? (
                      <img
                        src={verifiedMark}
                        alt="verifiedMark"
                        style={{ margin: "0 0 5px 5px", width: "15px" }}
                      />
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

                  <span className="profileList-info-title">{pro.title}</span>
                  <span className="profileList-info-career">{pro.career}</span>
                  {/* <button>See detail</button> */}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListExperts;
