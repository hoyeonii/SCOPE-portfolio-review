import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { toast } from "react-toastify";
import { db, storage } from "../../firebaseConfig";
import { deleteObject, ref } from "firebase/storage";

function DeleteArticle({ id, imageUrl }) {
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "Portfolio", id));
      toast("Deleted successfully", { type: "success" });

      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (err) {
      toast("Deleting fail", { type: "error" });
      console.log(err);
    }
  };
  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default DeleteArticle;
