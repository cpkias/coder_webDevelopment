import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful! 🎉");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', color: '#333' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Login</h2>
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;