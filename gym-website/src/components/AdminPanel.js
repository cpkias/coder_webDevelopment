import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function AdminPanel() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inquiries"), (snapshot) => {
      setInquiries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      await deleteDoc(doc(db, "inquiries", id));
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '1rem' }}>Admin Panel - Inquiries</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p><strong>Name:</strong> {inquiry.name}</p>
              <p><strong>Email:</strong> {inquiry.email}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
              <p><strong>Time:</strong> {inquiry.createdAt?.toDate().toLocaleString()}</p>
              <button
                onClick={() => handleDelete(inquiry.id)}
                style={{ marginTop: '0.5rem', backgroundColor: '#dc3545', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: '#333' }}>No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;