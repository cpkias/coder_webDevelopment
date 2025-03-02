import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User registered successfully');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><br/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required /><br/>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;