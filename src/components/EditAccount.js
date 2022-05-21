import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Timestamp,
  collection,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { storage, db, auth } from "./../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function EditAccount({ setSignUpModalOn }) {
  //   const { id } = useParams();
  const [user] = useAuthState(auth); //로그인 했는지 확인
  let navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [field, setField] = useState("");
  const [title, setTitle] = useState("");
  const [career, setCareer] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [profile, setProfile] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const [saveButton, setSaveButton] = useState("Submit");

  useEffect(() => {
    // console.log(user.uid);
    // console.log(auth.currentUser);
    // console.log(auth.currentUser.password);
    getDoc(doc(db, "Profile", user.uid)).then((snap) => {
      snap && setProfile(snap.data());
      // console.log(snap.data().expert);
      setDisplayName(snap.data().displayName);
      setField(snap.data().field);
      setTitle(snap.data().title);
      setCareer(snap.data().career);
      setAboutMe(snap.data().aboutMe);
    });
  }, []);

  //   if (docSnap.exists()) {
  //     console.log("Document data:", );
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }

  //   useEffect(() => {
  //     const profileRef = doc(db, "Profile", user.uid);
  //     // Set the "capital" field of the city 'DC'
  //     updateDoc(profileRef, {
  //       field: field,
  //       displayName: displayName,
  //       title: title,
  //     });
  //   }, [field]);

  const setValues = async (e) => {
    // setDisplayName(e.target[5].value + " " + e.target[6].value);
    let name = profile.displayName.split(" ");
    console.log(name);

    e.target[1].value && setEmail(e.target[1].value);
    e.target[3].value && setPassword(e.target[3].value);

    if (e.target[5].value && e.target[6].value) {
      setDisplayName(e.target[5].value + " " + e.target[6].value);
    } else if (!e.target[5].value && e.target[6].value) {
      setDisplayName(name[0] + " " + e.target[6].value);
    } else if (e.target[5].value && !e.target[6].value) {
      setDisplayName(e.target[5].value + " " + name[1]);
    }
    e.target[7].value && setField(e.target[7].value);
    e.target[8].value && setTitle(e.target[8].value);
    console.log("setValues!");
  };

  const updateValues = async () => {
    const profileRef = doc(db, "Profile", user.uid);
    await updateDoc(profileRef, {
      field: field,
      displayName: displayName,
      title: title,
      career: career,
      aboutMe: aboutMe,
    });

    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        console.log("displayName updated!");
      })
      .catch((error) => {
        console.error(error);
      });

    // updateEmail(auth.currentUser, email)
    //   .then(() => {
    //     console.log("Email updated!");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // const auth = getAuth();

    // updatePassword(user, password)
    //   .then(() => {
    //     console.log("password updated!");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    console.log("updated!");
    console.log(field, title, displayName);
    setSignUpModalOn(false);

    // if (submitted == 1) {
    //   // navigate(`/profile/${user.uid}/${user.uid}`);
    //   // alert("Please Log in again"); //비번 바꿨을때만
    // }
  };

  // const resetPassword = () => {
  //   sendPasswordResetEmail(auth, email)
  //     .then(() => {
  //       console.log("Password reset email sent!");
  //       // ..
  //     })
  //     .catch((error) => {
  //       console.error(error.code);
  //       // ..
  //     });
  // };

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
  return (
    <div>
      EditAccount
      {/* <input
        // type="text"
        name="title"
        onChange={(e) => console.log(e.target.value)}
      ></input> */}
      <form
        onSubmit={() => {
          updateValues();
          // setValues(e).then(updateValues());
          // setSubmitted(submitted + 1);
          // setSaveButton("Save");
        }}
      >
        {/* <label>
          Current E-mail
          <input type="text" />
        </label>
        <label>
          New E-mail
          <input type="text" />
        </label>

        <label>
          Current Password
          <input type="text" />
        </label>
        <label>
          New Password
          <input type="text" />
        </label>
        <label>
          Confirm Password
          <input type="text" />
        </label> */}

        {/* ////오른쪽 */}

        <label>
          User Name
          <input
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
          />
        </label>

        <label type="dropbox">
          Field
          <select
            name="field"
            value={field}
            onChange={(e) => {
              setField(e.target.value);
            }}
          >
            {items.map((i) => (
              <option name={i}>{i}</option>
            ))}
            <option name="UX/UI">UX/UI</option>
          </select>
        </label>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </label>
        <label>
          Career
          <input
            type="text"
            value={career}
            onChange={(e) => {
              setCareer(e.target.value);
            }}
          />
        </label>
        <label>
          About me
          <input
            type="text"
            value={aboutMe}
            onChange={(e) => {
              setAboutMe(e.target.value);
            }}
          />
        </label>
        <input type="submit" value={saveButton} />
        {submitted == 1 ? "press again to save the data" : ""}
      </form>
      {/* <button onClick={resetPassword}>Send me password reset email </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target[0].value, auth.currentUser.password);

          // if (
          //   e.target[0].value &&
          //   e.target[0].value !== auth.currentUser.password
          // ) {
          //   alert(`Email doesn't match!`);
          // } else {
          //   setValues(e).then(updateValues());
          //   setSubmitted(submitted + 1);
          //   setSaveButton("Save");
          // }
        }}
      >
        <label>
          Current Password
          <input type="text" />
        </label>
        <label>
          New Password
          <input type="text" />
        </label>
        <label>
          Confirm Password
          <input type="text" />
        </label>
        <input type="submit" value="Change Password" />
      </form> */}
    </div>
  );
}

export default EditAccount;
