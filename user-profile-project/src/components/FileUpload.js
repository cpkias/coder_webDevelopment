import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        // Implement your file upload logic here
        // For example, you can use Firebase Storage or any other service
        try {
            // Example: Upload to Firebase Storage
            // const storageRef = firebase.storage().ref();
            // const fileRef = storageRef.child(file.name);
            // await fileRef.put(file);
            // alert('File uploaded successfully');
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="file-upload">
            <h2>File Upload</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} required /><br/>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default FileUpload;