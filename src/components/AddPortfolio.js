import {
  Timestamp,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import React, { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./css/AddPortfolio.css";

function AddPortfolio({ setSignUpModalOn }) {
  const [user] = useAuthState(auth); //로그인 했는지 확인
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: "",
    createData: Timestamp.now().toDate,
  });
  const [progress, setProgress] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [fileprogress, setFileprogress] = useState(0);

  ///firebase Profile 테이블에서 해당 유저 데이터 가져오기
  const profileRef = doc(db, "Profile", user.uid);
  let userProfile = [];
  onSnapshot(profileRef, (snapshot) => {
    userProfile.push(snapshot.data());
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e) => {
    setFormData({ ...formData, image: e.target.files[0], url: null });
  };
  const handleUrlChange = async (e) => {
    setFormData({ ...formData, url: e.target.value, image: null });
  };
  const handleUrlImageChange = async (e) => {
    setFormData({ ...formData, urlImage: e.target.files[0] });
  };
  const handleUpload = (e) => {
    if (
      !formData.title ||
      !formData.description ||
      (!formData.image && !formData.urlImage)
    ) {
      alert("Please fill all the fields");
      return;
    } else if (!thumbnail && !formData.urlImage) {
      alert("Please select thumbnail");
      return;
    }

    const storageRef = ref(
      storage,
      formData.image
        ? `/image/${Date.now()}${formData.image.name}`
        : `/image/${Date.now()}${formData.url}`
    );

    const uploadTask = uploadBytesResumable(
      storageRef,
      formData.image ? formData.image : formData.urlImage
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          file: "",
        });
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(userProfile);
          const articleRef = collection(db, "Portfolio");
          addDoc(articleRef, {
            title: formData.title,
            description: formData.description,
            url: formData.url,
            imageUrl: url,
            createDate: Timestamp.now().toDate(),
            profileImg: userProfile[0].imageUrl,
            createBy: user.displayName,
            userId: user.uid,
            likes: [],
            comments: [],
            field: userProfile[0].field,
            thumbnail: thumbnail,
          })
            .then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
              setSignUpModalOn(false);
            })
            .catch((err) => {
              toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  const reff = useRef(null);

  const onButtonClick = useCallback(() => {
    if (reff.current === null) {
      return;
    }

    toPng(reff.current, { cacheBust: true })
      .then((dataUrl) => {
        setLoading(true);
        const link = document.createElement("a");
        link.href = dataUrl;
        setThumbnail(dataUrl);
      })
      .then(() => setLoading(false))
      .catch((err) => {
        console.log(err);
      });
  }, [reff]);

  return (
    <div>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          {loading && (
            <div className="addport-loading-background">
              <div className="addport-loading">Loading..</div>
            </div>
          )}
          <div className="addport-input-file-container">
            <h2>Portfolio Upload</h2>
            <div className="addport-input-file-cover">
              <i class="fa-solid fa-file-lines"></i>
              <span className="addport-input-file-uploadPDF">Upload PDF</span>
              <span className="addport-input-file-maximum">Maximum 5MB</span>
              <span className="addport-input-file-uploadPDF">
                {formData.image && formData.image.name}
              </span>
            </div>
            <input
              type="file"
              name="image"
              // accept="image/*"
              className="addport-input-file"
              onChange={(e) => {
                handleImageChange(e);
              }}
            ></input>
          </div>

          <div className="addport-input-text-container">
            <span className="addport-input-text-or">or</span>
            <div className="addport-input-text-link">
              <label>URL</label>
              <input
                type="url"
                name="url"
                onChange={(e) => handleUrlChange(e)}
              />
            </div>

            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="">Introduction</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
            ></textarea>
            {/* <label htmlFor="">Image</label> */}
            {progress === 0 ? null : (
              <div className="progress">
                <div>{`uploading image ${progress}%`}</div>
              </div>
            )}
            <label>Thumbnail</label>
            {formData.image && (
              <div className="addport-pdf-thumbnail">
                <div className="addport-pdf-thumbnail-preview">
                  <button
                    onClick={() => {
                      pageNumber > 1 && setPageNumber(pageNumber - 1);
                    }}
                  >
                    {"<"}
                  </button>
                  <div
                    className="addPort-thumbnail"
                    ref={reff}
                    // style={{ width: "300px", height: "200px" }}
                  >
                    {/* {formData.url && <iframe src={formData.url} />} */}

                    <Document
                      file={formData.image}
                      onLoadSuccess={console.log(`yayyy`)}
                    >
                      <Page height={150} pageNumber={pageNumber} />
                    </Document>
                  </div>

                  <button
                    onClick={() => {
                      pageNumber < 5 && setPageNumber(pageNumber + 1);
                    }}
                  >
                    {">"}
                  </button>
                </div>
                <button
                  className="addport-pdf-thumbnail-saveBtn"
                  onClick={onButtonClick}
                >
                  Save as Thumbnail
                </button>
                {thumbnail && <div>Saved!</div>}
              </div>
            )}
            {formData.url && (
              <div className="addport-input-text-link-thumbnail">
                <div className="addport-input-text-link-thumbnail-preview">
                  <span>No image yet</span>
                  <img
                    id="thumbnail"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj1UU-9fy5fPAMrlsO9QmqcuAV5i65SBRDD4dTHS8kG9zD6U6piqsZFm7wyTC399RljYI&usqp=CAU"
                  />
                </div>

                <input
                  type="file"
                  name="urlImage"
                  accept="image/*"
                  onChange={(e) => {
                    e.preventDefault();
                    handleUrlImageChange(e);
                    if (e.target.files.length > 0) {
                      let src = URL.createObjectURL(e.target.files[0]);
                      let preview = document.getElementById("thumbnail");
                      preview.src = src;
                    }
                  }}
                />
              </div>
            )}
          </div>
          <button
            className="addPort-uploadBtn"
            onClick={(e) => handleUpload(e)}
          >
            Upload Portfolio
          </button>
        </>
      )}
    </div>
  );
}

export default AddPortfolio;
