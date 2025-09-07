import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/globalurl";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showBioInput, setShowBioInput] = useState(false);
  const [bio, setBio] = useState("");

  const userId = localStorage.getItem("user_id");

  // Load bio from localStorage
  useEffect(() => {
    if (userId) {
      const savedBio = localStorage.getItem(`bio_${userId}`);
      if (savedBio) setBio(savedBio);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}profile/${userId}`, {
          withCredentials: true,
        });
        console.log("Profile data:", res.data); // Debug
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Unable to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSaveBio = () => {
    localStorage.setItem(`bio_${userId}`, bio);
    setShowBioInput(false);
  };

  const handleDeleteBio = () => {
    localStorage.removeItem(`bio_${userId}`);
    setBio("");
    setShowBioInput(false);
  };

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;
  if (error) return <p className="text-center mt-4 error">{error}</p>;
  if (!profile) return <p className="text-center mt-4">No profile found</p>;

  return (
    <div className="profile-wrapper">
      {/* Left: Profile container */}
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              profile.avatar
                ? `${baseUrl}avatar/${profile.avatar}`
                : "/default-avatar.png"
            }
            alt="Avatar"
            className="avatar"
          />
          <h2>
            {profile.alumni_name}{" "}
            {Number(profile.status) === 1 && (
              <span className="verified-tick" title="Verified">✅</span>
            )}
          </h2>
          <p>{profile.user_email}</p>
        </div>

        <div className="profile-details">
          <p><strong>Course:</strong> {profile.course || "N/A"}</p>
          <p><strong>Batch:</strong> {profile.batch || "N/A"}</p>
          <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
          <p><strong>Connected To:</strong> {profile.connected_to || "N/A"}</p>

<p>
  {profile.linkedin_url ? (
    <a 
      href={profile.linkedin_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ textDecoration: 'none', color: '#0e76a8', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
    >
      <i className="fab fa-linkedin fa-lg"></i> : Connect me here
    </a>
  ) : "N/A"}
</p>

<p>
   {profile.company_url ? (
    <a 
      href={profile.company_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ textDecoration: 'none', color: '#4CAF50', fontWeight: 'bold' }}
    >
      <i className="fas fa-globe fa-lg"></i> : Visit My Workplace
    </a>
  ) : "N/A"}
</p>


          <p><strong>Phone:</strong> {profile.phone  || "N/A"}</p>
          {/* <p><strong>LinkedIn:</strong> {profile.linkedin_url ? (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">{profile.linkedin_url}</a>
          ) : "N/A"}</p> */}
          <p><strong>Current Location:</strong> {profile.current_location || "N/A"}</p>
          {/* <p><strong>Company Website:</strong> {profile.company_url ? (
            <a href={profile.company_url} target="_blank" rel="noopener noreferrer">{profile.company_url}</a>
          ) : "N/A"}</p> */}
        </div>
      </div>

      {/* Right: Bio Box */}
      <div className="bio-box">
        <div className="bio-header">
          <h3 className="bio-heading">About Me</h3>
          <div className="bio-actions">
            <FaEdit
              className="bio-icon"
              title={bio ? "Edit Bio" : "Add Bio"}
              onClick={() => setShowBioInput(true)}
            />
            <FaTrash
              className="bio-icon delete"
              title="Delete Bio"
              onClick={handleDeleteBio}
            />
          </div>
        </div>

        {showBioInput && (
          <div className="bio-input">
            <textarea
              rows="3"
              placeholder="Write your bio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            <br />
            <button onClick={handleSaveBio} className="save-bio-btn">
              {bio ? "Update Bio" : "Save Bio"}
            </button>
          </div>
        )}

        {bio && <div className="bio-display">{bio}</div>}
      </div>
    </div>
  );
};

export default Profile;
