import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
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
import LoadingPage from "./helper/LoadingPage";

function Portfolio() {
  const { id } = useParams();

  const [user] = useAuthState(auth);
  const [portId, setPortId] = useState(id);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState([]);
  const [numSimilar, setNumSimilar] = useState(4);

  const handleWindowResize = useCallback(() => {
    setNumSimilar(Math.floor(window.innerWidth / 300));
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  useEffect(() => {
    console.log("rerender! " + portId);
    const docRef = doc(db, "Portfolio", portId);

    onSnapshot(docRef, (snapshot) => {
      setPortfolio({ ...snapshot.data(), id: snapshot.id });
    });
  }, [file, portId]);

  useEffect(() => {
    console.log(profile.id, profile);
    if (portfolio.url) {
      setUrl(portfolio.url);
      setFile("");
      setLoading(true);
    } else {
      setUrl("");
      setFile(portfolio.imageUrl);
      setLoading(true);
    }
    try {
      const profileRef = doc(db, "Profile", portfolio.userId);
      onSnapshot(profileRef, (snapshot) => {
        setProfile({ ...snapshot.data(), id: snapshot.id });
      });
      console.log(profile.id, profile);
    } catch (error) {
      console.log(error);
    }
  }, [portfolio]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
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

  document.querySelector("iframe") &&
    document.querySelector("iframe").addEventListener("load", function () {
      console.log("ysss");
      setLoading(false);
    });
  return (
    <div>
      <div className="portfolio-upper">
        {loading && <LoadingPage />}

        {portfolio && (
          <section className="portfolio">
            <div className="portfolio-profile">
              <Link to={`/profile/${profile.id}`}>
                <div className="portfolio-profile-left">
                  <img
                    src={profile.imageUrl}
                    alt="profilePic"
                    height={70}
                    width={70}
                    style={{
                      borderRadius: "50%",
                      // border: "1px solid gray",
                      marginRight: "20px",
                      objectFit: "cover",
                    }}
                  ></img>

                  <div>
                    <div>
                      <span className="displayName">{profile.displayName}</span>
                      <span className="field">{profile.field}</span>
                    </div>
                    <div>
                      <span>{profile.title}</span>
                      <span> ?? </span>
                      <span>{profile.career} of experience</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="portfolio-profile-right">
                {user && user.uid === portfolio.userId ? (
                  <DeleteArticle
                    id={portfolio.id}
                    imageUrl={portfolio.imageUrl}
                  />
                ) : (
                  profile.id && (
                    <div>
                      <FollowProfile
                        id={profile.id}
                        followers={profile.followers}
                      />
                      <LikeProfile id={portfolio.id} likes={portfolio.likes} />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="portfolio-portfolio">
              {url === "" && ( ///?????????????????? url??? ?????? pdf ????????????
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
              )}
              {url !== "" && ( //??????????????? ????????? url??????
                <div className="portfolio-viewPortfolio">
                  <iframe src={url} allowfullscreen />
                </div>
              )}
              <div className="portfolio-viewPortfolio-introduction">
                <span>Introduction</span>
                <p>{portfolio.description}</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-viewPortfolio-introduction-visit"
                >
                  Visit the site
                </a>
              </div>
            </div>
          </section>
        )}
        <section className="portfolio-comment">
          <Comment
            id={portId}
            pageNumber={pageNumber}
            userId={user && user.uid}
          />
        </section>
      </div>
      <section className="portfolio-related">
        <span>Similar portfolios</span>
        {portfolio.field && (
          <ListPortfolios
            curPortId={portId}
            byField={portfolio.field}
            viewMode={"latest"}
            numPortfolio={numSimilar}
            setPortId={setPortId}
          />
        )}
      </section>
    </div>
  );
}

export default Portfolio;
