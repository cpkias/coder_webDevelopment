import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        joinedAt: new Date(),
      });
      alert("Signup Successful! 🎉");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', color: '#333' }}>
      <form onSubmit={handleSignup} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Signup</h2>
        <input
          type="email"
          placeholder="Email"
          style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', padding: '0.5rem', marginTop: '0.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;