import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBuilding, FaMapMarker, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import ViewJobs from '../admin/view/ViewJobs';
import ManageJobs from '../admin/save/ManageJobs';
import { useAuth } from '../AuthContext';
import { baseUrl } from '../utils/globalurl';

const Careers = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    const [filteredJob, setFilteredJob] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [handleAdd, setHandleAdd] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    
    // Search state
    const [searchField, setSearchField] = useState('company'); // company, title, location, keyword
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        axios.get(`${baseUrl}auth/jobs`)
            .then((res) => {
                const jobsData = res.data;
                setJobs(jobsData);
                setFilteredJob(jobsData);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [handleAdd]);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredJob(jobs);
            setIsFiltered(false);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        const filteredCareer = jobs.filter(job => {
            switch(searchField) {
                case 'company':
                    return job.company.toLowerCase().includes(term);
                case 'title':
                    return job.job_title.toLowerCase().includes(term);
                case 'location':
                    return job.location.toLowerCase().includes(term);
                case 'keyword':
                    return job.description.toLowerCase().includes(term);
                default:
                    return true;
            }
        });
        
        setFilteredJob(filteredCareer);
        setIsFiltered(true);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSearchField('company'); // Reset dropdown to 'company'
        setFilteredJob(jobs);
        setIsFiltered(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Job List</h3>
                            <hr className="divider my-4" />
                            <div className="row col-md-12 mb-2 justify-content-center">
                                {isLoggedIn ?
                                    <> {handleAdd ? <></> : (
                                        <button onClick={() => setHandleAdd(true)} className="btn btn-primary btn-block col-sm-4" type="button" id="new_career">
                                            <FaPlus /> Post a Job Opportunity
                                        </button>
                                    )}
                                    </> : <p className='text-white'>Please Login to post jobs.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {handleAdd ? (
                <div className="container mt-5 pt-2">
                    <div className="col-lg-12">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row justify-content-center">
                                    <ManageJobs setHandleAdd={setHandleAdd} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mt-3 pt-2">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Search Jobs</h5>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-3">
                                    <label className="form-label">Search By</label>
                                    <select
                                        className="form-select"
                                        value={searchField}
                                        onChange={(e) => setSearchField(e.target.value)}
                                    >
                                        <option value="company">Company</option>
                                        <option value="title">Job Title</option>
                                        <option value="location">Location</option>
                                        <option value="keyword">Keyword</option>
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">Search Term</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Search by ${searchField}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <button 
                                        className="btn btn-primary me-2"
                                        onClick={handleSearch}
                                        disabled={!searchTerm.trim()}
                                    >
                                        <FaSearch /> Search
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={handleClearFilters}
                                        disabled={!isFiltered}
                                    >
                                        <FaTimes /> Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredJob.length > 0 ? (
                        filteredJob.map((j, index) => (
                            <div className="card job-list mb-3" key={index}>
                                <div className="card-body position-relative">
                                    <div className="remaining-time-top">
                                        <small>{j.remaining_time}</small>
                                    </div>
                                    <div className="row align-items-center justify-content-center text-center h-100">
                                        <div className="">
                                            <h4><b>{j.job_title}</b></h4>
                                            <div>
                                                <span className="me-3"><small><b><FaBuilding /> {j.company}</b></small></span>
                                                <span><small><b><FaMapMarker /> {j.location}</b></small></span>
                                            </div>
                                            <hr />
                                            <p dangerouslySetInnerHTML={{ __html: j.description }} className="truncate"></p>
                                            <br />
                                            <p>
                                              <strong>Deadline:</strong> {j.deadline ? new Date(j.deadline).toLocaleDateString() : 'N/A'}<br />
                                            </p>
                                            <hr className="divider" style={{ maxWidth: "80%" }} />
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className="badge bg-info">
                                                    <b><i>Posted by: {j.name}</i></b>
                                                </span>
                                                <button className="btn btn-sm btn-primary" onClick={() => openModal(j)}>
                                                    Read More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center py-4">
                            {isFiltered ? (
                                <>
                                    <p className="text-muted">No jobs match your search</p>
                                    <button className="btn btn-link" onClick={handleClearFilters}>
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <h4 className="text-info-emphasis">No Jobs Available</h4>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {isModalOpen && selectedJob && (
                <ViewJobs job={selectedJob} closeModal={closeModal} />
            )}
        </>
    );
};

export default Careers;


