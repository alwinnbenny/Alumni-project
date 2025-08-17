


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../utils/globalurl";
// import "./Profile.css";  // <-- import your CSS file

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showBioInput, setShowBioInput] = useState(false);
//   const [bio, setBio] = useState("");

//   const userId = localStorage.getItem("user_id");

//   // Load bio from localStorage
//   useEffect(() => {
//     if (userId) {
//       const savedBio = localStorage.getItem(`bio_${userId}`);
//       if (savedBio) setBio(savedBio);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (!userId) {
//       setError("User not logged in");
//       setLoading(false);
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}profile/${userId}`, {
//           withCredentials: true,
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError(err.response?.data?.message || "Unable to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   const handleSaveBio = () => {
//     localStorage.setItem(`bio_${userId}`, bio); // save to localStorage
//     setShowBioInput(false);
//   };

//   if (loading) return <p className="text-center mt-4">Loading profile...</p>;
//   if (error) return <p className="text-center mt-4 error">{error}</p>;
//   if (!profile) return <p className="text-center mt-4">No profile found</p>;

//   return (
//     <div className="profile-container">
//       {/* Add Bio Button */}
//       <button
//         onClick={() => setShowBioInput(true)}
//         className="bio-btn"
//       >
//         {bio ? "Edit Bio" : "Add Bio"}
//       </button>

//       <div className="profile-header">
//         <img
//           src={
//             profile.avatar
//               ? `${baseUrl}avatar/${profile.avatar}`
//               : "/default-avatar.png"
//           }
//           alt="Avatar"
//           className="avatar"
//         />
//         <h2>{profile.alumni_name}</h2>
//         <p>{profile.user_email}</p>
//       </div>

//       <div className="profile-details">
//         <p><strong>Course:</strong> {profile.course || "N/A"}</p>
//         <p><strong>Batch:</strong> {profile.batch || "N/A"}</p>
//         <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
//         <p><strong>Connected To:</strong> {profile.connected_to || "N/A"}</p>
//       </div>

//       {/* Bio Input Section */}
//       {showBioInput && (
//         <div className="bio-input">
//           <textarea
//             rows="3"
//             placeholder="Write your bio..."
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//           ></textarea>
//           <br />
//           <button onClick={handleSaveBio} className="save-bio-btn">
//             Save Bio
//           </button>
//         </div>
//       )}

//       {/* Show Bio */}
//       {bio && (
//         <div className="bio-display">
//           {bio}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../utils/globalurl";
// import "./Profile.css";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showBioInput, setShowBioInput] = useState(false);
//   const [bio, setBio] = useState("");

//   const userId = localStorage.getItem("user_id");

//   // Load bio from localStorage
//   useEffect(() => {
//     if (userId) {
//       const savedBio = localStorage.getItem(`bio_${userId}`);
//       if (savedBio) setBio(savedBio);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (!userId) {
//       setError("User not logged in");
//       setLoading(false);
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}profile/${userId}`, {
//           withCredentials: true,
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError(err.response?.data?.message || "Unable to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   const handleSaveBio = () => {
//     localStorage.setItem(`bio_${userId}`, bio);
//     setShowBioInput(false);
//   };

//   if (loading) return <p className="text-center mt-4">Loading profile...</p>;
//   if (error) return <p className="text-center mt-4 error">{error}</p>;
//   if (!profile) return <p className="text-center mt-4">No profile found</p>;

//   return (
//     <div className="profile-wrapper">
//       {/* Left: Profile container */}
//       <div className="profile-container">
//         <div className="profile-header">
//           <img
//             src={
//               profile.avatar
//                 ? `${baseUrl}avatar/${profile.avatar}`
//                 : "/default-avatar.png"
//             }
//             alt="Avatar"
//             className="avatar"
//           />
//           <h2>{profile.alumni_name}</h2>
//           <p>{profile.user_email}</p>
//         </div>

//         <div className="profile-details">
//           <p><strong>Course:</strong> {profile.course || "N/A"}</p>
//           <p><strong>Batch:</strong> {profile.batch || "N/A"}</p>
//           <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
//           <p><strong>Connected To:</strong> {profile.connected_to || "N/A"}</p>
//         </div>
//       </div>

//       {/* Right: Bio Box */}
//       <div className="bio-box">
//         <h3 className="bio-heading">Describe Yourself</h3>

//         {!showBioInput && (
//           <button onClick={() => setShowBioInput(true)} className="bio-btn">
//             {bio ? "Edit Bio" : "Add Bio"}
//           </button>
//         )}

//         {showBioInput && (
//           <div className="bio-input">
//             <textarea
//               rows="3"
//               placeholder="Write your bio..."
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             ></textarea>
//             <br />
//             <button onClick={handleSaveBio} className="save-bio-btn">
//               Save Bio
//             </button>
//           </div>
//         )}

//         {bio && <div className="bio-display">{bio}</div>}
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/globalurl";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
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
          <h2>{profile.alumni_name}</h2>
          <p>{profile.user_email}</p>
        </div>

        <div className="profile-details">
          <p><strong>Course:</strong> {profile.course || "N/A"}</p>
          <p><strong>Batch:</strong> {profile.batch || "N/A"}</p>
          <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
          <p><strong>Connected To:</strong> {profile.connected_to || "N/A"}</p>
        </div>
      </div>

      {/* Right: Bio Box */}
      <div className="bio-box">
        <div className="bio-header">
          <h3 className="bio-heading">About Me !</h3>

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
