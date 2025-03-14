import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return alert("All fields are required!");

    setLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      alert("Inquiry Sent Successfully! 🎉");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '5px', width: '400px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Contact Us</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Your Name"
          style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Message"
          style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', height: '100px' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>


<motion.button
  type="submit"
  style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {loading ? "Sending..." : "Send Inquiry"}
</motion.button>;

      </form>
    </div>
  );
}

export default ContactForm;