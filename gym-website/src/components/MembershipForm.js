import { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function MembershipForm() {
  const [membershipType, setMembershipType] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membershipType || !phone) return alert("All fields are required!");

    setLoading(true);
    const user = auth.currentUser;

    try {
      await setDoc(doc(db, "memberships", user.uid), {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email,
        phone: phone,
        membershipType: membershipType,
        joinedAt: new Date(),
      });

      alert("Membership Registered Successfully! 🎉");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '5px', width: '400px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Join Our Gym</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select
          style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={membershipType}
          onChange={(e) => setMembershipType(e.target.value)}
          required
        >
          <option value="">Select Membership Type</option>
          <option value="Basic">Basic - $30/month</option>
          <option value="Premium">Premium - $50/month</option>
          <option value="Elite">Elite - $80/month</option>
        </select>

        <input
          type="tel"
          placeholder="Phone Number"
          style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button type="submit" style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
          {loading ? "Registering..." : "Join Now"}
        </button>
      </form>
    </div>
  );
}

export default MembershipForm;