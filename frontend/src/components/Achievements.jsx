import React, { useState } from 'react';
import axios from 'axios';

const AchievementsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    form.append('date', formData.date);
    if (file) {
      form.append('attachment', file);
    }

    try {
      const response = await axios.post('/api/achievements', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message); // Success message
    } catch (error) {
      console.error('Error submitting achievement:', error);
      alert('Error submitting achievement.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Attachment</label>
        <input
          type="file"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Submit Achievement</button>
    </form>
  );
};

export default AchievementsForm;
