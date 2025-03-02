import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), {
                name,
                email
            });
            alert('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    return (
        <div className="profile">
            <h2>Profile</h2>
            <form onSubmit={handleSaveProfile}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required /><br/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><br/>
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default Profile;