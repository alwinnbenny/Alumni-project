import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [userRole, setUserRole] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const response = await axios.delete(`${baseUrl}auth/achievements/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          setAchievements(achievements.filter((ach) => ach.id !== id));
        }
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Failed to delete achievement. Admins only.');
      }
    }
  };

  return (
    <div>
      <h2>Achievements</h2>
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
                  src={`${baseUrl}/Public/Images/${achievement.attachment}`} // Fixed path
                  alt={achievement.title}
                  style={{ width: '100px', height: '100px' }}
                  onError={(e) => {
                    e.target.src = '/fallback-image.jpg'; // Ensure this exists in frontend public/
                    console.error('Image load failed:', `${baseUrl}/Public/Images/${achievement.attachment}`);
                  }}
                />
              )}
              {userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(achievement.id)}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              )}
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