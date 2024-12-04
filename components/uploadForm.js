import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // Import useSession to get the session

const UploadForm = () => {
  const { data: session } = useSession(); // Get session data
  const [file, setFile] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // Handles the file change event
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handles the mime type change event
  const handleMimeTypeChange = (e) => {
    setMimeType(e.target.value);
  };

  // Handles the file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    // Log the MIME type and file info for debugging
    console.log('File:', file);
    console.log('User-provided MIME Type:', mimeType);

    // Send file to the backend for uploading
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mimeType', mimeType);

    try {
      const token = session?.accessToken; // Get the access token from the session

      // Log the session and token for debugging
      console.log('User Session:', session);
      console.log('AccessToken:', token);

      // Ensure token is available before making the request
      if (!token) {
        throw new Error('No access token available. User may not be authenticated.');
      }

      const response = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      setUploadStatus('File uploaded successfully');
      console.log('Upload Response:', response.data); // Log the response from the server
    } catch (error) {
      setUploadStatus('Error uploading file');
      console.error('Upload Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Upload a file</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label htmlFor="file">Choose file:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="mimeType">MIME Type (Optional):</label>
          <input
            type="text"
            id="mimeType"
            value={mimeType}
            onChange={handleMimeTypeChange}
            placeholder="e.g., image/jpeg"
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default UploadForm;
