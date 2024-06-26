import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Replace with your Flask server URL

const containerStyle = {
  maxWidth: '800px',  // Adjust the maximum width as needed
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#D4EDDA',  // Light pastel green background
  borderRadius: '10px',  // Optional: to make the container have rounded corners
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Optional: to add a slight shadow for better visual effect
};

const formStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  marginBottom: '10px',
  padding: '8px',
  fontSize: '16px',
  width: '100%',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  margin: '0 10px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
};

const postContainerStyle = {
  marginBottom: '20px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#fff',  // White background for individual posts
};

const titleStyle = {
  fontSize: '20px',
  marginBottom: '10px',
};

const contentStyle = {
  fontSize: '16px',
};

function App() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editMode, setEditMode] = useState(false); // Track whether in edit mode
  const [editPostId, setEditPostId] = useState(null); // Track which post to edit

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && editPostId) {
        // If in edit mode, update the post
        await axios.put(`${API_URL}/posts/${editPostId}`, formData);
        setEditMode(false);
        setEditPostId(null);
      } else {
        // Otherwise, create a new post
        await axios.post(`${API_URL}/posts`, formData);
      }
      fetchPosts();  // Refresh posts after successful creation or update
      setFormData({ title: '', content: '' });  // Clear form
    } catch (error) {
      console.error('Error creating or updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${postId}`);
      console.log(response.data);
      fetchPosts();  // Refresh posts after successful deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (postId, title, content) => {
    // Set form data to edit mode with pre-filled values
    setFormData({ title, content });
    setEditMode(true);
    setEditPostId(postId);
  };

  return (
    <div className="App" style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Share Your Thoughts</h1>
      <form style={formStyle} onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" style={inputStyle} required />
        <br />
        <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Content" style={{ ...inputStyle, height: '100px' }} required />
        <br />
        <button type="submit" style={buttonStyle}>{editMode ? 'Update Post' : 'Create Post'}</button>
        {editMode && <button type="button" onClick={() => { setEditMode(false); setEditPostId(null); setFormData({ title: '', content: '' }); }} style={buttonStyle}>Cancel</button>}
      </form>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>All Posts:</h2>
      {posts.map(post => (
        <div key={post._id} style={postContainerStyle}>
          <h3 style={titleStyle}>{post.title}</h3>
          <p style={contentStyle}>{post.content}</p>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => handleDelete(post._id)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Delete</button>
            <button onClick={() => handleEdit(post._id, post.title, post.content)} style={{ ...buttonStyle, backgroundColor: '#2196F3' }}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
