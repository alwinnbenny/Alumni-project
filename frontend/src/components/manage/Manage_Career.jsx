// // import axios from 'axios';
// // import React, { useState, useEffect } from 'react';
// // import { ToastContainer, toast } from 'react-toastify';
// // import { baseUrl } from '../../utils/globalurl';

// // const Manage_Career = () => {
// //     const [formData, setFormData] = useState({
// //         id: '',
// //         company: '',
// //         job_title: '',
// //         location: '',
// //         description: ''
// //     });

// //     const [jobList, setJobList] = useState([]);
// //     const [displayedJobs, setDisplayedJobs] = useState([]);
// //     const [searchFilters, setSearchFilters] = useState({
// //         company: '',
// //         job_title: '',
// //         location: '',
// //         description: ''
// //     });
// //     const [isFiltered, setIsFiltered] = useState(false);

// //     useEffect(() => {
// //         fetchJobs();
// //     }, []);

// //     const fetchJobs = () => {
// //         axios.get(`${baseUrl}auth/job_list`)
// //             .then(res => {
// //                 setJobList(res.data);
// //                 setDisplayedJobs(res.data); // Initially show all jobs
// //             })
// //             .catch(err => {
// //                 console.error(err);
// //                 toast.error('Failed to fetch jobs');
// //             });
// //     };

// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     const handleSearchFilterChange = (e) => {
// //         setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
// //     };

// //     const handleSearch = (e) => {
// //         e.preventDefault();
// //         const filtered = jobList.filter(job =>
// //             (searchFilters.company === '' || job.company.toLowerCase().includes(searchFilters.company.toLowerCase())) &&
// //             (searchFilters.job_title === '' || job.job_title.toLowerCase().includes(searchFilters.job_title.toLowerCase())) &&
// //             (searchFilters.location === '' || job.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
// //             (searchFilters.description === '' || job.description.toLowerCase().includes(searchFilters.description.toLowerCase()))
// //         );
// //         setDisplayedJobs(filtered);
// //         setIsFiltered(true);
// //     };

// //     const handleClear = () => {
// //         setSearchFilters({
// //             company: '',
// //             job_title: '',
// //             location: '',
// //             description: ''
// //         });
// //         setDisplayedJobs(jobList); // Show all jobs again
// //         setIsFiltered(false);
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const response = await axios.post(`${baseUrl}auth/managejob`, formData);
// //             toast.success(response.data.message);
// //             setFormData({
// //                 id: '',
// //                 company: '',
// //                 job_title: '',
// //                 location: '',
// //                 description: ''
// //             });
// //             fetchJobs(); // Refresh the job list
// //         } catch (error) {
// //             console.error('Error:', error);
// //             toast.error(error.response?.data?.message || 'An error occurred');
// //         }
// //     };

// //     return (
// //         <>
// //             <ToastContainer position="top-center" />
// //             <div className="container-fluid">
// //                 <div className="card mb-4">
// //                     <div className="card-header bg-primary text-white">
// //                         <h5>Add New Job</h5>
// //                     </div>
// //                     <div className="card-body">
// //                         <form onSubmit={handleSubmit}>
// //                             <input type="hidden" name="id" value={formData.id} />
// //                             <div className="row mb-3">
// //                                 <div className="col-md-6">
// //                                     <label className="form-label">Company</label>
// //                                     <input 
// //                                         type="text" 
// //                                         name="company" 
// //                                         className="form-control" 
// //                                         value={formData.company} 
// //                                         onChange={handleChange} 
// //                                         required 
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-6">
// //                                     <label className="form-label">Job Title</label>
// //                                     <input 
// //                                         type="text" 
// //                                         name="job_title" 
// //                                         className="form-control" 
// //                                         value={formData.job_title} 
// //                                         onChange={handleChange} 
// //                                         required 
// //                                     />
// //                                 </div>
// //                             </div>
// //                             <div className="row mb-3">
// //                                 <div className="col-md-6">
// //                                     <label className="form-label">Location</label>
// //                                     <input 
// //                                         type="text" 
// //                                         name="location" 
// //                                         className="form-control" 
// //                                         value={formData.location} 
// //                                         onChange={handleChange} 
// //                                         required 
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-6">
// //                                     <label className="form-label">Description</label>
// //                                     <textarea 
// //                                         name="description" 
// //                                         className="form-control" 
// //                                         value={formData.description} 
// //                                         onChange={handleChange} 
// //                                         required
// //                                     ></textarea>
// //                                 </div>
// //                             </div>
// //                             <div className="text-end">
// //                                 <button type="submit" className="btn btn-primary">Submit</button>
// //                             </div>
// //                         </form>
// //                     </div>
// //                 </div>

// //                 {/* Search Filters */}
// //                 <div className="card mb-4">
// //                     <div className="card-header bg-primary text-white">
// //                         <h5>Search Jobs</h5>
// //                     </div>
// //                     <div className="card-body">
// //                         <form onSubmit={handleSearch}>
// //                             <div className="row mb-3">
// //                                 <div className="col-md-3">
// //                                     <label className="form-label">Company</label>
// //                                     <input
// //                                         type="text"
// //                                         name="company"
// //                                         placeholder="Filter by company"
// //                                         className="form-control"
// //                                         value={searchFilters.company}
// //                                         onChange={handleSearchFilterChange}
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-3">
// //                                     <label className="form-label">Job Title</label>
// //                                     <input
// //                                         type="text"
// //                                         name="job_title"
// //                                         placeholder="Filter by job title"
// //                                         className="form-control"
// //                                         value={searchFilters.job_title}
// //                                         onChange={handleSearchFilterChange}
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-3">
// //                                     <label className="form-label">Location</label>
// //                                     <input
// //                                         type="text"
// //                                         name="location"
// //                                         placeholder="Filter by location"
// //                                         className="form-control"
// //                                         value={searchFilters.location}
// //                                         onChange={handleSearchFilterChange}
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-3">
// //                                     <label className="form-label">Description</label>
// //                                     <input
// //                                         type="text"
// //                                         name="description"
// //                                         placeholder="Filter by description"
// //                                         className="form-control"
// //                                         value={searchFilters.description}
// //                                         onChange={handleSearchFilterChange}
// //                                     />
// //                                 </div>
// //                             </div>
// //                             <div className="text-end">
// //                                 <button 
// //                                     type="button" 
// //                                     className="btn btn-secondary me-2" 
// //                                     onClick={handleClear}
// //                                     disabled={!isFiltered}
// //                                 >
// //                                     Clear Filters
// //                                 </button>
// //                                 <button 
// //                                     type="submit" 
// //                                     className="btn btn-primary"
// //                                 >
// //                                     Search Jobs
// //                                 </button>
// //                             </div>
// //                         </form>
// //                     </div>
// //                 </div>

// //                 {/* Job Results */}
// //                 <div className="card">
// //                     <div className="card-header bg-primary text-white">
// //                         <h5>{isFiltered ? 'Filtered Jobs' : 'All Jobs'}</h5>
// //                     </div>
// //                     <div className="card-body">
// //                         {displayedJobs.length > 0 ? (
// //                             <div className="list-group">
// //                                 {displayedJobs.map((job, index) => (
// //                                     <div key={index} className="list-group-item mb-3">
// //                                         <div className="d-flex justify-content-between">
// //                                             <h5>{job.job_title}</h5>
// //                                             <span className="badge bg-info">{job.company}</span>
// //                                         </div>
// //                                         <p className="text-muted mb-1">
// //                                             <i className="bi bi-geo-alt"></i> {job.location}
// //                                         </p>
// //                                         <p>{job.description}</p>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         ) : (
// //                             <div className="alert alert-info">
// //                                 {isFiltered ? 'No jobs found matching your criteria.' : 'No jobs available.'}
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // export default Manage_Career;


// // import axios from 'axios';
// // import React, { useState, useEffect } from 'react';
// // import { ToastContainer, toast } from 'react-toastify';
// // import { baseUrl } from '../../utils/globalurl';

// // const Manage_Career = () => {
// //     const [formData, setFormData] = useState({
// //         id: '',
// //         company: '',
// //         job_title: '',
// //         location: '',
// //         description: ''
// //     });

// //     const [jobList, setJobList] = useState([]);
// //     const [filteredJobs, setFilteredJobs] = useState([]);
// //     const [searchFilters, setSearchFilters] = useState({
// //         company: '',
// //         job_title: '',
// //         location: '',
// //         description: ''
// //     });

// //     useEffect(() => {
// //         // Get all jobs once
// //         axios.get(`${baseUrl}auth/job_list`)
// //             .then(res => {
// //                 setJobList(res.data);
// //             })
// //             .catch(err => console.error(err));
// //     }, []);

// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     const handleSearchFilterChange = (e) => {
// //         setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
// //     };

// //     const handleSearch = () => {
// //         const filtered = jobList.filter(job =>
// //             (searchFilters.company === '' || job.company.toLowerCase().includes(searchFilters.company.toLowerCase())) &&
// //             (searchFilters.job_title === '' || job.job_title.toLowerCase().includes(searchFilters.job_title.toLowerCase())) &&
// //             (searchFilters.location === '' || job.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
// //             (searchFilters.description === '' || job.description.toLowerCase().includes(searchFilters.description.toLowerCase()))
// //         );
// //         setFilteredJobs(filtered);
// //     };

// //     const handleClear = () => {
// //         setSearchFilters({
// //             company: '',
// //             job_title: '',
// //             location: '',
// //             description: ''
// //         });
// //         setFilteredJobs([]);
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         await axios.post(`${baseUrl}auth/managejob`, formData)
// //             .then((res) => {
// //                 toast.success(res.data.message);
// //                 setFormData({
// //                     id: '',
// //                     company: '',
// //                     job_title: '',
// //                     location: '',
// //                     description: ''
// //                 });
// //             })
// //             .catch((error) => {
// //                 console.error('Error:', error);
// //                 toast.error('An error occurred');
// //             });
// //     };

// //     return (
// //         <>
// //             <ToastContainer position="top-center" />
// //             <div className="container-fluid">
// //                 <form onSubmit={handleSubmit}>
// //                     <input type="hidden" name="id" value={formData.id} className="form-control" />
// //                     <div className="row form-group">
// //                         <div className="col-md-8">
// //                             <label className="control-label">Company</label>
// //                             <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} />
// //                         </div>
// //                     </div>
// //                     <div className="row form-group">
// //                         <div className="col-md-8">
// //                             <label className="control-label">Job Title</label>
// //                             <input type="text" name="job_title" className="form-control" value={formData.job_title} onChange={handleChange} />
// //                         </div>
// //                     </div>
// //                     <div className="row form-group">
// //                         <div className="col-md-8">
// //                             <label className="control-label">Location</label>
// //                             <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
// //                         </div>
// //                     </div>
// //                     <div className="row form-group">
// //                         <div className="col-md-8">
// //                             <label className="control-label">Description</label>
// //                             <textarea name="description" className="form-control" value={formData.description} onChange={handleChange}></textarea>
// //                         </div>
// //                     </div>
// //                     <div className='col-md-8 mb-4'>
// //                         <button type="submit" className="btn btn-primary">Submit</button>
// //                     </div>
// //                 </form>

// //                 {/* Filters */}
// //                 <div className="card p-3 mb-3">
// //                     <h5>Search Job Filters</h5>
// //                     <div className="row">
// //                         <div className="col-md-3 mb-2">
// //                             <input
// //                                 type="text"
// //                                 name="company"
// //                                 placeholder="Company"
// //                                 className="form-control"
// //                                 value={searchFilters.company}
// //                                 onChange={handleSearchFilterChange}
// //                             />
// //                         </div>
// //                         <div className="col-md-3 mb-2">
// //                             <input
// //                                 type="text"
// //                                 name="job_title"
// //                                 placeholder="Job Title"
// //                                 className="form-control"
// //                                 value={searchFilters.job_title}
// //                                 onChange={handleSearchFilterChange}
// //                             />
// //                         </div>
// //                         <div className="col-md-3 mb-2">
// //                             <input
// //                                 type="text"
// //                                 name="location"
// //                                 placeholder="Location"
// //                                 className="form-control"
// //                                 value={searchFilters.location}
// //                                 onChange={handleSearchFilterChange}
// //                             />
// //                         </div>
// //                         <div className="col-md-3 mb-2">
// //                             <input
// //                                 type="text"
// //                                 name="description"
// //                                 placeholder="Description"
// //                                 className="form-control"
// //                                 value={searchFilters.description}
// //                                 onChange={handleSearchFilterChange}
// //                             />
// //                         </div>
// //                         <div className="col-md-3 mb-2">
// //                             <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
// //                         </div>
// //                         <div className="col-md-3 mb-2">
// //                             <button className="btn btn-secondary w-100" onClick={handleClear}>Clear Filters</button>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Filtered Job Results */}
// //                 {filteredJobs.length > 0 && (
// //                     <div className="card p-3">
// //                         <h5>Search Results:</h5>
// //                         {filteredJobs.map((job, index) => (
// //                             <div key={index} className="border rounded p-3 mb-3">
// //                                 <p><strong>Company:</strong> {job.company}</p>
// //                                 <p><strong>Job Title:</strong> {job.job_title}</p>
// //                                 <p><strong>Location:</strong> {job.location}</p>
// //                                 <p><strong>Description:</strong> {job.description}</p>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // };

// // export default Manage_Career;




// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';
// // import { ToastContainer, toast } from 'react-toastify';
// // import { baseUrl } from '../../utils/globalurl';

// // const Manage_Career = () => {
// //     const [formData, setFormData] = useState({
// //         company: '',
// //         job_title: '',
// //         location: '',
// //         description: ''
// //     });
// //     const [jobs, setJobs] = useState([]);
// //     const [filteredJobs, setFilteredJobs] = useState([]);
// //     const [showResults, setShowResults] = useState(false);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         axios.get(`${baseUrl}auth/getalljobs`)
// //             .then(res => {
// //                 setJobs(res.data);
// //                 setLoading(false);
// //             })
// //             .catch(err => {
// //                 console.error(err);
// //                 toast.error('Failed to load jobs');
// //                 setLoading(false);
// //             });
// //     }, []);

// //     const handleChange = (e) => {
// //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
// //     };

// //     const handleSearch = () => {
// //         const filtered = jobs.filter(job =>
// //             (!formData.company || job.company?.toLowerCase().includes(formData.company.toLowerCase())) &&
// //             (!formData.job_title || job.job_title?.toLowerCase().includes(formData.job_title.toLowerCase())) &&
// //             (!formData.location || job.location?.toLowerCase().includes(formData.location.toLowerCase())) &&
// //             (!formData.description || job.description?.toLowerCase().includes(formData.description.toLowerCase()))
// //         );
// //         setFilteredJobs(filtered);
// //         setShowResults(true);
// //     };

// //     const handleClear = () => {
// //         setFormData({ company: '', job_title: '', location: '', description: '' });
// //         setFilteredJobs([]);
// //         setShowResults(false);
// //     };

// //     return (
// //         <>
// //             <ToastContainer position="top-center" />
// //             <div className="container-fluid">
// //                 <h3 className="mb-3">Manage Careers</h3>
// //                 <div className="card mb-4">
// //                     <div className="card-body">
// //                         <div className="row mb-2">
// //                             <div className="col-md-3">
// //                                 <input
// //                                     type="text"
// //                                     name="company"
// //                                     className="form-control"
// //                                     placeholder="Filter by Company"
// //                                     value={formData.company}
// //                                     onChange={handleChange}
// //                                 />
// //                             </div>
// //                             <div className="col-md-3">
// //                                 <input
// //                                     type="text"
// //                                     name="job_title"
// //                                     className="form-control"
// //                                     placeholder="Filter by Job Title"
// //                                     value={formData.job_title}
// //                                     onChange={handleChange}
// //                                 />
// //                             </div>
// //                             <div className="col-md-3">
// //                                 <input
// //                                     type="text"
// //                                     name="location"
// //                                     className="form-control"
// //                                     placeholder="Filter by Location"
// //                                     value={formData.location}
// //                                     onChange={handleChange}
// //                                 />
// //                             </div>
// //                             <div className="col-md-3">
// //                                 <input
// //                                     type="text"
// //                                     name="description"
// //                                     className="form-control"
// //                                     placeholder="Filter by Description"
// //                                     value={formData.description}
// //                                     onChange={handleChange}
// //                                 />
// //                             </div>
// //                         </div>
// //                         <div className="row">
// //                             <div className="col-md-6">
// //                                 <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>
// //                                     Search
// //                                 </button>
// //                                 <button type="button" className="btn btn-secondary" onClick={handleClear}>
// //                                     Clear Filters
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {loading && (
// //                     <div className="text-center my-4">
// //                         <div className="spinner-border text-primary" role="status">
// //                             <span className="sr-only">Loading...</span>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {showResults && (
// //                     <div className="card">
// //                         <div className="card-body">
// //                             {filteredJobs.length > 0 ? (
// //                                 <div className="table-responsive">
// //                                     <table className="table table-bordered table-hover">
// //                                         <thead>
// //                                             <tr>
// //                                                 <th>Company</th>
// //                                                 <th>Job Title</th>
// //                                                 <th>Location</th>
// //                                                 <th>Description</th>
// //                                             </tr>
// //                                         </thead>
// //                                         <tbody>
// //                                             {filteredJobs.map((job, idx) => (
// //                                                 <tr key={idx}>
// //                                                     <td>{job.company}</td>
// //                                                     <td>{job.job_title}</td>
// //                                                     <td>{job.location}</td>
// //                                                     <td>{job.description}</td>
// //                                                 </tr>
// //                                             ))}
// //                                         </tbody>
// //                                     </table>
// //                                 </div>
// //                             ) : (
// //                                 <p className="text-center text-muted">No results found</p>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // };

// // export default Manage_Career;





  import axios from 'axios';
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../../utils/globalurl';


const Manage_Career = () => {
    const [formData, setFormData] = useState({
        id: '',
        company: '',
        job_title: '',
        location: '',
        description: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleBack = () => {
        // navigate("/dashboard/jobs");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform insert operation
        await axios.post(`${baseUrl}auth/managejob`, formData)
            .then((res) => {
                toast.success(res.data.message)
                setFormData({
                    id: "",
                    company: "",
                    job_title: "",
                    location: "",
                    description: "",
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('An error occurred');
            })
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="container-fluid">
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={formData.id} className="form-control" />
                    <div className="row form-group">
                        <div className="col-md-8">
                            <label className="control-label">Company</label>
                            <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-8">
                            <label className="control-label">Job Title</label>
                            <input type="text" name="job_title" className="form-control" value={formData.job_title} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-8">
                            <label className="control-label">Location</label>
                            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-8">
                            <label className="control-label">Description</label>
                            <textarea name="description" className="text-jqte form-control" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="button" className="btn btn-outline-danger float-end" onClick={handleBack}>Back</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Manage_Career
