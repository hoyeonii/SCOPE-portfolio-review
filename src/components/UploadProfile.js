import { Timestamp, collection, doc, setDoc, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import AddPortfolio from "./AddPortfolio";
import PdfToImg from "./helper/PdfToImg";

function UploadProfile() {
  const [user] = useAuthState(auth); //로그인 했는지 확인

  const [formData, setFormData] = useState({
    title: "",
    field: "",
    file: "",
    createData: Timestamp.now().toDate,
  });
  const [progress, setProgress] = useState(0);
  const [checked, setChecked] = useState(false);
  //   const [fileprogress, setFileprogress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpload = (e) => {
    if (!formData.title || !formData.field || !formData.image) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/profileImage/${Date.now()}${formData.image.name}` //뭐가 안되면 files를 image로 바꿔야할수도?
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
          field: "",
          image: "",
          verifyMe: "",
        });

        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // const articleRef = collection(db, "Profile");
          setDoc(doc(db, "Profile", user.uid), {
            // 여기 addDoc으로 고쳐야할수도
            title: formData.title,
            field: formData.field,
            imageUrl: url,
            createDate: Timestamp.now().toDate(),
            displayName: user.displayName,
            userId: user.uid,
            verifyMe: checked,
            expert: false,
            followers: [],
          })
            .then(() => {
              toast("Profile added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding Profile", { type: "error" });
            });
        });
      }
    );
  };
  return (
    <div>
      Upload Profile <h2>Upload Profile</h2>
      <label htmlFor="">Career Field</label>
      {/* <input
      name="field"
      value={formData.field}
      onChange={(e) => handleChange(e)}
    ></input> */}
      <select
        name="field"
        value={formData.field}
        onChange={(e) => handleChange(e)}
      >
        <option name="UX/UI">UX/UI</option>
        <option name="3D">3D</option>
        <option name="Web">Web</option>
        <option name="fashion">fashion</option>
      </select>
      <label htmlFor="">Job Title</label>
      <input
        // type="text"
        name="title"
        value={formData.title}
        onChange={(e) => handleChange(e)}
      ></input>
      <div>
        Would you like to verify your job title to gain Expert status?
        <input
          type="checkbox"
          name="verifyMe"
          onChange={(e) => {
            console.log(e.target.checked);
            setChecked(e.target.checked);
          }}
        ></input>
        Yes, verify me!
      </div>
      <label htmlFor="">Image</label>
      <input
        type="file"
        name="image"
        onChange={(e) => handleImageChange(e)}
      ></input>
      {progress === 0 ? null : (
        <div className="progress">
          <div>{`uploading image ${progress}%`}</div>
        </div>
      )}
      <button onClick={(e) => handleUpload(e)}>Upload</button>
    </div>
  );
}

export default UploadProfile;
