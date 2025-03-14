import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import ProfileUpload from "../components/ProfileUpload";
import MembershipForm from "../components/MembershipForm";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch user details
      const userDocRef = doc(db, "users", user.uid);
      onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });

      // Fetch membership details
      const membershipDocRef = doc(db, "memberships", user.uid);
      onSnapshot(membershipDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setMembershipData(docSnap.data());
        }
      });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', color: '#333' }}>
      {userData ? (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '5px', textAlign: 'center', width: '400px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome, {userData.name}!</h2>
          {userData.profileImage && (
            <img
              src={userData.profileImage}
              alt="Profile"
              style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '1rem auto' }}
            />
          )}
          <p>Email: {userData.email}</p>
          <p>Joined On: {userData.joinedAt.toDate().toDateString()}</p>

          <ProfileUpload />

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Membership Status:</h3>
          {membershipData ? (
            <p style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem' }}>
              {membershipData.membershipType} Member
            </p>
          ) : (
            <MembershipForm />
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;