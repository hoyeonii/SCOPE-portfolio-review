import {
  Timestamp,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import PdfThumbnail from "react-pdf-thumbnail";
import samplePDF from "../samplePDF.pdf";
import ViewThumbnail from "./ViewThumbnail";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./css/AddPortfolio.css";

function AddPortfolio() {
  const [user] = useAuthState(auth); //로그인 했는지 확인
  // const [file, setFile] = React.useState([]);
  //   console.log(user.uid);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: "",
    createData: Timestamp.now().toDate,
  });
  const [progress, setProgress] = useState(0);
  //   const [fileprogress, setFileprogress] = useState(0);

  ///firebase Profile 테이블에서 해당 유저 데이터 가져오기
  const profileRef = collection(db, "Profile");
  const q = query(profileRef, where("userId", "==", user.uid));
  let userProfile = [];
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      userProfile.push({ ...doc.data(), id: doc.id });
    });
    // console.log(userProfile[0].field);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpload = (e) => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/image/${Date.now()}${formData.image.name}` //뭐가 안되면 files를 image로 바꿔야할수도?
    );

    const uploadTask = uploadBytesResumable(storageRef, formData.image);

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
          const articleRef = collection(db, "Portfolio");
          addDoc(articleRef, {
            title: formData.title,
            description: formData.description,
            imageUrl: url,
            createDate: Timestamp.now().toDate(),
            profileImg: userProfile[0].imageUrl,
            createBy: user.displayName,
            userId: user.uid,
            likes: [],
            comments: [],
            field: userProfile[0].field,
          })
            .then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  //   const formHandler = (e) => {
  //     e.preventDefault();
  //     const file = e.target[0].files[0];
  //     uploadFiles(file);
  //   };

  //   const uploadFiles = (file) => {
  //     if (!file) return;
  //     const storageRef = ref(
  //       storage,
  //       `/files/${Date.now()}${formData.image.name}`
  //     );

  //     const uploadTask = uploadBytesResumable(storageRef, file);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const prog = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );

  //         setProgress(prog);
  //       },
  //       (err) => console.log(err),
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
  //       }
  //     );
  //   };
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        console.log(dataUrl);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);
  return (
    <div>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          {" "}
          <h2>Upload Portfolio</h2>
          <label htmlFor="">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => handleChange(e)}
          ></input>
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          ></textarea>
          <label htmlFor="">Image</label>
          <input
            type="file"
            name="image"
            // accept="image/*"
            onChange={(e) => handleImageChange(e)}
          ></input>
          {progress === 0 ? null : (
            <div className="progress">
              <div>{`uploading image ${progress}%`}</div>
            </div>
          )}
          <button onClick={(e) => handleUpload(e)}>Upload</button>
          <div
            className="addPort-thumbnail"
            ref={ref}
            style={{ width: "300px" }}
          >
            <Document
              file={formData.image}
              onLoadSuccess={() => {
                console.log("yayyy");
              }}
            >
              <Page height={150} pageNumber={1} />
            </Document>
          </div>
          <button onClick={onButtonClick}>Click me</button>
          {/* <ViewThumbnail /> */}
          {/* <form onSubmit={formHandler}>
              <input type="file" />
              <button type="submit">Upload</button>
            </form>
            <h3>Upload {fileprogress}</h3> */}
        </>
      )}
    </div>
  );
}

export default AddPortfolio;
