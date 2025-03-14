import { useState } from "react";
import { storage, db, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

function ProfileUpload() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    setLoading(true);
    const user = auth.currentUser;
    const imageRef = ref(storage, `profileImages/${user.uid}`);

    try {
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", user.uid), {
        profileImage: imageUrl,
      });

      alert("Profile Image Uploaded Successfully! 🎉");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload} style={{ backgroundColor: '#007bff', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

export default ProfileUpload;