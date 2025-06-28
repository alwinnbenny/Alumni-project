import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For enlarged image


  useEffect(() => {
    const role = localStorage.getItem('userType');
    setUserRole(role);

    const fetchAchievements = async () => {
      try {
        const response = await axios.get(`${baseUrl}auth/achievements`);
        console.log('Achievements response:', response.data); // Debug log
        setAchievements(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this achievement?')) {
  //     try {
  //       const response = await axios.delete(`${baseUrl}auth/achievements/${id}`, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //       });
  //       if (response.data.success) {
  //         setAchievements(achievements.filter((ach) => ach.id !== id));
  //       }
  //     } catch (error) {
  //       console.error('Error deleting achievement:', error);
  //       alert('Failed to delete achievement. Admins only.');
  //     }
  //   }
  // };


  // const deleteAchievement = async (id) => {
  //   // Get the JWT token from localStorage or wherever it's stored
  //   const token = localStorage.getItem("token");
  
  //   if (!token) {
  //     console.error("User is not logged in.");
  //     alert("You need to log in to delete achievements.");
  //     return;
  //   }
  
  //   try {
  //     const response = await axios.delete(`${baseUrl}/auth/achievements/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,  // Send the JWT token in the Authorization header
  //       },
  //     });
  //     console.log("Achievement deleted:", response.data);
  //   } catch (error) {
  //     console.error('Error deleting achievement:', error.response?.data || error.message);
  //     alert("You do not have permission to delete this achievement.");
  //   }
  // };
  
  // const deleteAchievement = async (id) => {
  //   try {
  //     const response = await axios.delete(`${baseUrl}/auth/achievements/${id}`);
  //     console.log("Achievement deleted:", response.data);
  //   } catch (error) {
  //     console.error('Error deleting achievement:', error.response?.data || error.message);
  //     alert("You do not have permission to delete this achievement.");
  //   }
  // };
  const deleteAchievement = async (id) => {
    try {
      // Assuming you have the token stored (e.g., in localStorage or cookies)
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${baseUrl}/auth/achievements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Send token for authentication
        }
      });
      
      console.log("Achievement deleted:", response.data);
    } catch (error) {
      console.error('Error deleting achievement:', error.response?.data || error.message);
      alert("You do not have permission to delete this achievement.");
    }
  };
  
  return (
    <div>
      <h2>Achievements</h2>
      {selectedImage && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    {/* Close Button */}
    <button
      onClick={() => setSelectedImage(null)}
      style={{
        position: 'absolute',
        top: '20px',
        right: '30px',
        fontSize: '30px',
        color: '#fff',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1001,
      }}
    >
      &times;
    </button>

    {/* Enlarged Image */}
    <img
  src={selectedImage}
  alt="Enlarged"
  style={{
    width: 'auto',
    height: '90vh',
    maxWidth: '95vw',
    objectFit: 'contain',
    borderRadius: '10px',
    boxShadow: '0 0 20px white',
  }}
/>

  </div>
)}

      <div>
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id}>
              <h3>{achievement.title}</h3>
              <p>{achievement.description || 'N/A'}</p>
              <p>Category: {achievement.category || 'N/A'}</p>
              <p>
                Date Achieved:{' '}
                {achievement.date_achieved && !isNaN(new Date(achievement.date_achieved).getTime())
                  ? new Date(achievement.date_achieved).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                Added On:{' '}
                {achievement.created_at && !isNaN(new Date(achievement.created_at).getTime())
                  ? new Date(achievement.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
              {achievement.attachment && (
                <img
                  src={`${baseUrl}/images/${achievement.attachment}`} // Fixed path
                  alt={achievement.title}
                  style={{ width: '100px', height: '100px' , cursor: 'pointer' }}
  onClick={() => setSelectedImage(`${baseUrl}/images/${achievement.attachment}`)}
                  onError={(e) => {
                    e.target.src = 'defaultachievement.png'; // Ensure this exists in frontend public/
                    console.error('Image load failed:', `${baseUrl}/public/images/${achievement.attachment}`);
                  }}
                />
              )}
       {/* {userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(achievement.id)}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }} */}
                {/* >
                  Delete
                </button>
              )} */}
            </div>
          ))
        ) : (
          <p>No achievements available</p>
        )}
      </div>
    </div>
  );
};

export default AchievementsList;