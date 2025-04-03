import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('/api/achievements');
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div>
      <h2>Achievements</h2>
      <div>
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id}>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <p>Category: {achievement.category}</p>
              <p>Date: {new Date(achievement.date).toLocaleDateString()}</p>
              {achievement.attachment && (
                <img
                  src={`/uploads/${achievement.attachment}`}
                  alt={achievement.title}
                  style={{ width: '100px', height: '100px' }}
                />
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
