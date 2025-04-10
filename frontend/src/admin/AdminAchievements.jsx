// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { baseUrl } from "../utils/globalurl";
// import { useAuth } from "../AuthContext";

// const Achievements = () => {
//   const { isAdmin } = useAuth();
//   const [achievements, setAchievements] = useState([]);
//   const [alumni, setAlumni] = useState([]);
//   const [formData, setFormData] = useState({
//     alumnus_id: "",
//     title: "",
//     description: "",
//     date_achieved: "",
//     category: "",
//     attachment: "",
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${baseUrl}auth/achievements`)
//       .then((res) => {
//         setAchievements(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((err) => {
//         console.error("Error fetching achievements:", err);
//         toast.error("Failed to load achievements");
//         setAchievements([]);
//       });

//     axios
//       .get(`${baseUrl}auth/alumni`)
//       .then((res) => {
//         setAlumni(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((err) => {
//         console.error("Error fetching alumni:", err);
//         toast.error("Failed to load alumni list");
//         setAlumni([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({ ...formData, [name]: files[0] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const submitData = new FormData();

//     submitData.append("alumnus_id", formData.alumnus_id);
//     submitData.append("title", formData.title);
//     submitData.append("description", formData.description);
//     submitData.append("date_achieved", formData.date_achieved);
//     submitData.append("category", formData.category);
//     if (formData.attachment) {
//       submitData.append("attachment", formData.attachment);
//     }

//     axios
//       .post(`${baseUrl}auth/achievements`, submitData)
//       .then((res) => {
//         if (res.data.success) {
//           toast.success(res.data.message);
//           axios
//             .get(`${baseUrl}auth/achievements`)
//             .then((res) => {
//               setAchievements(Array.isArray(res.data) ? res.data : []);
//             });

//           setFormData({
//             alumnus_id: "",
//             title: "",
//             description: "",
//             date_achieved: "",
//             category: "",
//             attachment: "",
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Error adding achievement:", err);
//         toast.error("Failed to add achievement");
//       });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this achievement?")) {
//       axios
//         .delete(`${baseUrl}auth/achievements/${id}`)
//         .then((res) => {
//           if (res.data.success) {
//             toast.success(res.data.message);
//             setAchievements(achievements.filter((ach) => ach.id !== id));
//           }
//         })
//         .catch((err) => {
//           console.error("Error deleting achievement:", err);
//           toast.error("Failed to delete achievement");
//         });
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-center" />
//       <div className="container mt-4">
//         <h2 className="mb-4">Achievements</h2>

//         {/* Add Achievement Form - Admin Only */}
//         {isAdmin && (
//           <div className="card mb-4">
//             <div className="card-body">
//               <h4>Add New Achievement</h4>
//               {loading ? (
//                 <p>Loading...</p>
//               ) : (
//                 <form onSubmit={handleSubmit} encType="multipart/form-data">
//                   <div className="form-group">
//                     <label htmlFor="alumnus_id">Alumnus</label>
//                     <select
//                       name="alumnus_id"
//                       id="alumnus_id"
//                       className="form-control"
//                       value={formData.alumnus_id}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select Alumnus</option>
//                       {alumni.length > 0 ? (
//                         alumni.map((alum) => (
//                           <option key={alum.id} value={alum.id}>
//                             {alum.name} ({alum.email})
//                           </option>
//                         ))
//                       ) : (
//                         <option value="" disabled>
//                           No alumni available
//                         </option>
//                       )}
//                     </select>
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="title">Title</label>
//                     <input
//                       type="text"
//                       name="title"
//                       id="title"
//                       className="form-control"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="description">Description</label>
//                     <textarea
//                       name="description"
//                       id="description"
//                       className="form-control"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="date_achieved">Date Achieved</label>
//                     <input
//                       type="date"
//                       name="date_achieved"
//                       id="date_achieved"
//                       className="form-control"
//                       value={formData.date_achieved}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="category">Category</label>
//                     <input
//                       type="text"
//                       name="category"
//                       id="category"
//                       className="form-control"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="attachment">Attachment (Photo)</label>
//                     <input
//                       type="file"
//                       name="attachment"
//                       id="attachment"
//                       className="form-control"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                   </div>
//                   <button type="submit" className="btn btn-primary mt-2">
//                     Add Achievement
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Achievements List */}
//         <div className="card">
//           <div className="card-body">
//             <h4>Achievements List</h4>
//             {loading ? (
//               <p>Loading...</p>
//             ) : achievements.length === 0 ? (
//               <p>No achievements recorded yet.</p>
//             ) : (
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>Achiever</th>
//                     <th>Title</th>
//                     <th>Description</th>
//                     <th>Date Achieved</th>
//                     <th>Image</th>
//                     <th>Added on</th>
//                     {isAdmin && <th>Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {achievements.map((ach) => (
//                     <tr key={ach.id}>
//                       <td>{ach.name}</td>
//                       <td>{ach.title}</td>
//                       <td>{ach.description || "N/A"}</td>
//                       <td>
//                         {ach.date_achieved
//                           ? new Date(ach.date_achieved).toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td>
//                         {ach.attachment ? (
//                           ach.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
//                             <img
//                               src={`${baseUrl}uploads/${ach.attachment}`}
//                               alt="Attachment"
//                               style={{
//                                 width: 60,
//                                 height: "auto",
//                                 borderRadius: 4,
//                               }}
//                             />
//                           ) : (
//                             <a
//                               href={`${baseUrl}uploads/${ach.attachment}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               View
//                             </a>
//                           )
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td>{new Date(ach.created_at).toLocaleDateString()}</td>
//                       {isAdmin && (
//                         <td>
//                           <button
//                             className="btn btn-danger btn-sm"
//                             onClick={() => handleDelete(ach.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Achievements;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../utils/globalurl";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [alumni, setAlumni] = useState([]); // Initial state is an empty array
  const [formData, setFormData] = useState({
    alumnus_id: "",
    title: "",
    description: "",
    date_achieved: "",
    category: "", // category field
    attachment:"", // attachment field
  });
  const [loading, setLoading] = useState(true); // Loading state to handle async fetch

  useEffect(() => {
    // Fetch all achievements
    axios
      .get(`${baseUrl}auth/achievements`)
      .then((res) => {
        setAchievements(Array.isArray(res.data) ? res.data : []); // Ensure array
      })
      .catch((err) => {
        console.error("Error fetching achievements:", err);
        toast.error("Failed to load achievements");
        setAchievements([]); // Fallback to empty array
      });

    // Fetch alumni for dropdown
    axios
      .get(`${baseUrl}auth/alumni`)
      .then((res) => {
        console.log("Alumni response:", res.data); // Log to debug
        setAlumni(Array.isArray(res.data) ? res.data : []); // Ensure array
      })
      .catch((err) => {
        console.error("Error fetching alumni:", err);
        toast.error("Failed to load alumni list");
        setAlumni([]); // Fallback to empty array
      })
      .finally(() => setLoading(false)); // Mark loading complete
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] }); // Save the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData(); // Create a FormData object for file upload

    // Append form data including file
    submitData.append("alumnus_id", formData.alumnus_id);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("date_achieved", formData.date_achieved);
    submitData.append("category", formData.category);
    if (formData.attachment) {
      submitData.append("attachment", formData.attachment); // Append file if exists
    }

    axios
      .post(`${baseUrl}auth/achievements`, submitData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          const selectedAlumnus = alumni.find(
            (a) => a.id === parseInt(formData.alumnus_id)
          );
          // setAchievements([
          //   ...achievements,
          //   {
          //     ...formData,
          //     id: res.data.id,
          //     name: selectedAlumnus ? selectedAlumnus.name : "Unknown",
          //   },
          // ]);
          axios
  .get(`${baseUrl}auth/achievements`)
  .then((res) => {
    setAchievements(Array.isArray(res.data) ? res.data : []);
  });


          setFormData({
            alumnus_id: "",
            title: "",
            description: "",
            date_achieved: "",
            category: "",
            attachment: "",
          });
        }
      })
      .catch((err) => {
        console.error("Error adding achievement:", err);
        toast.error("Failed to add achievement");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      axios
        .delete(`${baseUrl}auth/achievements/${id}`)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            setAchievements(achievements.filter((ach) => ach.id !== id));
          }
        })
        .catch((err) => {
          console.error("Error deleting achievement:", err);
          toast.error("Failed to delete achievement");
        });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="container mt-4">
        <h2 className="mb-4">Achievements</h2>

        {/* Add Achievement Form */}
        <div className="card mb-4">
          <div className="card-body">
            <h4>Add New Achievement</h4>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="alumnus_id">Alumnus</label>
                  <select
                    name="alumnus_id"
                    id="alumnus_id"
                    className="form-control"
                    value={formData.alumnus_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Achiever</option>
                    {Array.isArray(alumni) && alumni.length > 0 ? (
                      alumni.map((alum) => (
                        <option key={alum.id} value={alum.id}>
                          {alum.name} ({alum.email})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No alumni available</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date_achieved">Date Achieved</label>
                  <input
                    type="date"
                    name="date_achieved"
                    id="date_achieved"
                    className="form-control"
                    value={formData.date_achieved}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="attachment">Attachment (Photo)</label>
                  <input
                    type="file"
                    name="attachment"
                    id="attachment"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                  Add Achievement
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Achievements List */}
        <div className="card">
          <div className="card-body">
            <h4>Achievements List</h4>
            {loading ? (
              <p>Loading...</p>
            ) : achievements.length === 0 ? (
              <p>No achievements recorded yet.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Achiever</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date Achieved</th>
                    <th>Image</th>
                    <th>Added on</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((ach) => (
                    <tr key={ach.id}>
                      <td>{ach.name}</td>
                      <td>{ach.title}</td>
                      <td>{ach.description || "N/A"}</td>
                      <td>{ach.date_achieved ? new Date(ach.date_achieved).toLocaleDateString() : "N/A"}</td>
                      <td>
  {ach.attachment ? (
    ach.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
      <img
        src={`${baseUrl}images/${ach.attachment}`}
        alt="Attachment"
        style={{ width: 60, height: "auto", borderRadius: 4 }}
      />
    ) : (
      <a
        href={`${baseUrl}images/${ach.attachment}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    )
  ) : (
    "N/A"
  )}
</td>

                      <td>{new Date(ach.created_at).toLocaleDateString()}</td>
                      {/* <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(ach.id)}
                        >
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Achievements;
