import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import defaultavatar from "../assets/uploads/defaultavatar.jpg";
import { baseUrl } from '../utils/globalurl';

const AlumniList = () => {
    const [alumniList, setAlumniList] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}auth/alumni_list`)
            .then((res) => {
                setAlumniList(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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
                                        <center>
                                            <img
                                                src={a.avatar ? `${baseUrl}${a.avatar}` : defaultavatar}
                                                className="card-img-top img-fluid alimg"
                                                alt="avatar"
                                            />
                                        </center>
                                        <div className="card-body">
                                            <h5 className="card-title text-center pad-zero">
                                                {a.name} <small>
                                                    <i className={`badge badge-primary ${a.status === 1 ? '' : 'd-none'}`}>Verified</i>
                                                    <i className={`badge badge-warning ${a.status === 0 ? '' : 'd-none'}`}>Unverified</i>
                                                </small>
                                            </h5>
                                            <p className="card-text"><strong>Email:</strong> {a.email}</p>
                                            {a.course && <p className="card-text"><strong>Course:</strong> {a.course}</p>}
                                            {a.batch !== "0000" && <p className="card-text"><strong>Batch:</strong> {a.batch}</p>}
                                            {a.connected_to && <p className="card-text"><strong>Currently working in/as:</strong> {a.connected_to}</p>}
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
