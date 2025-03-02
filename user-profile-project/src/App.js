import React from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import FileUpload from './components/FileUpload';
import './App.css';

const App = () => {
    return (
        <div>
            <h1>User Profile Submission Form</h1>
            <SignUp />
            <Login />
            <Profile />
            <FileUpload />
        </div>
    );
};

export default App;