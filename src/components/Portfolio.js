import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import Comment from "./Comment.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import DeleteArticle from "./helper/DeleteArticle";
import LikeProfile from "./helper/LikeProfile";
import "./css/Portfolio.css";
import FollowProfile from "./helper/FollowProfile";
import ListPortfolios from "./helper/ListPortfolios";

function Portfolio() {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  const [portfolio, setPortfolio] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState("");
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "Portfolio", id);

    onSnapshot(docRef, (snapshot) => {
      setPortfolio({ ...snapshot.data(), id: snapshot.id });
      setFile(portfolio.imageUrl);
    });
  }, [file]);

  useEffect(() => {
    console.log(profile.id, profile);
    try {
      const profileRef = doc(db, "Profile", portfolio.userId);
      onSnapshot(profileRef, (snapshot) => {
        setProfile({ ...snapshot.data(), id: snapshot.id });
      });
      console.log(profile.id, profile);
    } catch (error) {
      console.log(error);
    }

    // console.log(profile);
  }, [portfolio]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  return (
    <div>
      <div className="portfolio-upper">
        {portfolio && (
          <section className="portfolio-portfolio">
            <div className="portfolio-profile">
              <div className="portfolio-profile-left">
                <img
                  src={profile.imageUrl}
                  alt="profilePic"
                  height={40}
                  width={40}
                  style={{
                    borderRadius: "50%",
                    border: "1px solid gray",
                    marginRight: "10px",
                  }}
                ></img>
                <div>{portfolio.title}</div>
              </div>
              <div className="portfolio-profile-right">
                {user && user.uid === portfolio.userId ? (
                  <DeleteArticle
                    id={portfolio.id}
                    imageUrl={portfolio.imageUrl}
                  />
                ) : (
                  // <button
                  //   onClick={(e) => {
                  //     e.preventDefault();
                  //     console.log(profile, profile.id);
                  //   }}
                  // >
                  //   folow
                  // </button>
                  profile.id && (
                    <div>
                      <LikeProfile id={portfolio.id} likes={portfolio.likes} />
                      <FollowProfile
                        id={profile.id}
                        followers={profile.followers}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="portfolio-viewPortfolio">
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document>
              <div className="portfolio-viewPortfolio-button">
                {pageNumber > 1 ? (
                  <button onClick={changePageBack}>
                    <i class="fa-solid fa-angle-left"></i>
                  </button>
                ) : (
                  <button style={{ opacity: "30%", cursor: "default" }}>
                    <i class="fa-solid fa-angle-left"></i>
                  </button>
                )}
                {pageNumber < numPages ? (
                  <button onClick={changePageNext}>
                    <i class="fa-solid fa-angle-right"></i>
                  </button>
                ) : (
                  <button style={{ opacity: "30%", cursor: "default" }}>
                    <i class="fa-solid fa-angle-right"></i>
                  </button>
                )}
              </div>
              <div className="portfolio-viewPortfolio-pagenum">
                Slide {pageNumber} / {numPages}
              </div>
            </div>
            <div className="portfolio-viewPortfolio-description">
              {portfolio.description}
            </div>
          </section>
        )}

        <section className="portfolio-comment">
          <Comment id={id} pageNumber={pageNumber} userId={user && user.uid} />
        </section>
      </div>
      <section className="portfolio-related">
        field: {portfolio.field}
        {/* <ListPortfolios byField={portfolio.field} numPortfolio={4} /> */}
        {portfolio.field && (
          <ListPortfolios
            byField={portfolio.field}
            viewMode={"latest"}
            numPortfolio={4}
          />
        )}
      </section>
    </div>
  );
}

export default Portfolio;