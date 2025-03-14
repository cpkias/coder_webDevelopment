function Membership() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f4f4', color: '#333', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Membership Plans</h1>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Basic Plan - ₹999/month</h2>
          <p>Access to gym equipment & group classes.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Premium Plan - ₹1999/month</h2>
          <p>Includes personal training & diet consultation.</p>
        </div>
      </div>
    </div>
  );
}

export default Membership;