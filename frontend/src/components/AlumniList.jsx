import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import defaultavatar from "../assets/uploads/defaultavatar.jpg";
import { baseUrl } from '../utils/globalurl';
import { useLocation } from 'react-router-dom';

const AlumniList = () => {
    const [alumniList, setAlumniList] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const location = useLocation(); // Track navigation
  
    const fetchAlumni = () => {
      setLoading(true);
      axios.get(`${baseUrl}auth/alumni_list`)
        .then((res) => {
          setAlumniList(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
  
    useEffect(() => {
      fetchAlumni(); // Fetch on mount and when location changes
    }, [location.pathname]);
  
    const uniqueBatches = [...new Set(
      alumniList.map(a => a.batch !== undefined && a.batch !== null ? a.batch.toString() : null).filter(b => b && b !== "0000")
    )];
    const uniqueCourses = [...new Set(alumniList.map(a => a.course).filter(Boolean))];
    const uniqueConnections = [...new Set(alumniList.map(a => a.connected_to).filter(Boolean))];
  
    const handleSearch = () => {
      setHasSearched(true);
      const filtered = alumniList.filter(alumni => {
        if (!selectedFilter || !filterValue) return false;
        switch (selectedFilter) {
          case 'name':
            return alumni.name?.toLowerCase().includes(filterValue.toLowerCase());
          case 'course':
            return alumni.course === filterValue;
          case 'batch':
            return alumni.batch?.toString() === filterValue;
          case 'connected_to':
            return alumni.connected_to === filterValue;
          default:
            return false;
        }
      });
      setFilteredAlumni(filtered);
    };
  
    const handleClear = () => {
      setSelectedFilter('');
      setFilterValue('');
      setFilteredAlumni([]);
      setHasSearched(false);
      fetchAlumni(); // Refresh list on clear
    };
  
    return (
        <>
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Alumnae List</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-4">
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <select className="form-control" value={selectedFilter} onChange={(e) => {
                                    setSelectedFilter(e.target.value);
                                    setFilterValue('');
                                }}>
                                    <option value="">Select Filter</option>
                                    <option value="name">Name</option>
                                    <option value="course">Course</option>
                                    <option value="batch">Batch</option>
                                    <option value="connected_to">Connected To</option>
                                </select>
                            </div>

                            {selectedFilter && (
                                <div className="col-md-4 mb-2">
                                    {selectedFilter === 'name' ? (
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter name"
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                        />
                                    ) : (
                                        <select className="form-control" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                                            <option value="">Select</option>
                                            {(selectedFilter === 'course' ? uniqueCourses :
                                                selectedFilter === 'batch' ? uniqueBatches :
                                                    uniqueConnections).map((item, idx) => (
                                                        <option key={idx} value={item}>{item}</option>
                                                    ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            <div className="col-md-2 mb-2">
                                <button className="btn btn-primary btn-block" onClick={handleSearch}>
                                    <FaSearch /> Search
                                </button>
                            </div>

                            <div className="col-md-2 mb-2">
                                <button className="btn btn-secondary btn-block" onClick={handleClear}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid mt-3 pt-2">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : hasSearched ? (
                    filteredAlumni.length > 0 ? (
                        <div className="row">
                            {filteredAlumni.map((a, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div className="card h-100 shadow-sm">
                                        <img
                                          //  src={a.avatar ? `/avatar/${a.avatar}` : defaultavatar}

                                            //src={a.avatar ? `${baseUrl}avatar/${a.avatar}` : defaultavatar}
                                            src={a.avatar ? `http://localhost:3000/avatar/${a.avatar}` : defaultavatar}
                                            className="card-img-top img-fluid alimg"
                                            alt={`${a.name}'s avatar`}
                                            style={{
                                            //  
                                            width: '150px',
                                            margin: '20px auto',   // center horizontally
        display: 'block',  
    height: 'auto',            // Keeps original image height based on width
    objectFit: 'contain',      // Fit image inside without cropping
    borderRadius: '0.5rem',
                                              }}  // optional: remove any rounding
                                        //     className="card-img-top img-fluid alimg"
                                        //     //alt={`${a.name}'s avatar`}
                                        //     style={{ height: '250px', objectFit: 'cover' }}
                                        //    // console.log('Avatar Path:', a.avatar);

                                        />
                                        <div className="card-body text-center">
                                            <h5 className="card-title text-center pad-zero">
                                                {a.name} <small>
                                                    {a.status === 1 && (
    <i className="badge badge-primary">Verified</i>
  )}
                                                </small>
                                            </h5>
                                             {a.batch !== "0000" && (
                                            <p className="card-text" ><strong>Batch:</strong> {a.batch}</p>
                                             )}
                                            {a.course && (
                                                <p className="card-text"><strong>Course:</strong> {a.course}</p>
                                            )}
                                           
                                                <p className="card-text"><strong>Email:</strong> {a.email}</p>
                                            
                                            {a.connected_to && (
                                                <p className="card-text"><strong>Currently working in/as:</strong> {a.connected_to}</p>
                                            )}


                                            {a.linkedin_url && (
  <p className="card-text">
   
    <a 
      href={a.linkedin_url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: '#0e76a8', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
    >
      <i className="fab fa-linkedin fa-lg"></i> : Connect me here
    </a>
  </p>
)}

{a.company_url && (
  <p className="card-text">
    
    <a 
      href={a.company_url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: '#4CAF50', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
    >
      <i className="fas fa-globe fa-lg"></i> : Visit My Workplace
    </a>
  </p>
)}{a.phone && (
  <p className="card-text">
    
    <a href={`tel:${a.phone}`} style={{ textDecoration: 'none', color: '#007bff', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <i className="fas fa-phone-alt"></i> {a.phone}
    </a>
  </p>
)}

  {/* {a.linkedin_url && (
    <p className="card-text">
      <strong>LinkedIn:</strong> 
      <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer">{a.linkedin_url}</a>
    </p>
  )}

  {a.company_url && (
    <p className="card-text">
      <strong>Company:</strong> 
      <a href={a.company_url} target="_blank" rel="noopener noreferrer">{a.company_url}</a>
    </p>
  )} */}

  {a.current_location && (
    <p className="card-text"><strong>Location:</strong> {a.current_location}</p>
  )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <h5>No Data Available</h5>
                        </div>
                    )
                ) : (
                    <div className="text-center text-muted py-4">
                        <em>Search to display alumni.</em>
                    </div>
                )}
            </div>
        </>
    );
};

export default AlumniList;
