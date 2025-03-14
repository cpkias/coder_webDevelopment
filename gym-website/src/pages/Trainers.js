function Trainers() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f4f4', color: '#333', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Meet Our Trainers</h1>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>John Doe</h2>
          <p>Expert in Strength Training & Nutrition</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Jane Smith</h2>
          <p>Cardio & Yoga Specialist</p>
        </div>
      </div>
    </div>
  );
}

export default Trainers;