import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../utils/globalurl';
import { FaSearch } from 'react-icons/fa';

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [searchYear, setSearchYear] = useState('');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = () => {
        axios.get(`${baseUrl}auth/gallery`)
            .then((res) => {
                setGallery(res.data);
            })
            .catch((err) => console.log(err));
    };

    // Group by batch
    const groupByBatch = (data) => {
        return data.reduce((groups, item) => {
            const batchKey =
                item.start_year && item.end_year
                    ? `${item.start_year} - ${item.end_year}`
                    : '';
            if (!groups[batchKey]) groups[batchKey] = [];
            groups[batchKey].push(item);
            return groups;
        }, {});
    };

    // Filter by start year if searchYear is entered
    const filteredGallery = searchYear
        ? gallery.filter((g) => g.start_year?.toString().includes(searchYear))
        : gallery;

    const groupedGallery = groupByBatch(filteredGallery);

    return (
        <>
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Gallery</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-4">
                {/* Search Bar */}
                <div className="input-group mb-4" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by start year..."
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                    />
                    <button className="btn btn-primary">
                        <FaSearch />
                    </button>
                </div>

                {/* Display grouped by batch with N/A first */}
                {Object.keys(groupedGallery)
                    .sort((a, b) => {
                        if (a === 'N/A') return -1;
                        if (b === 'N/A') return 1;
                        return a.localeCompare(b);
                    })
                    .map((batchKey) => (
                        <div key={batchKey} className="mb-5">
                            <h4 className="mb-3">{`Moments: ${batchKey}`}</h4>
                            <div className="row">
                                {groupedGallery[batchKey].map((g, index) => (
                                    <div className="col-12 col-sm-6 col-lg-4 padzero" key={index}>
                                        <div className="card gallery-list h-100">
                                            <img
                                                src={`${baseUrl}${g.image_path}`}
                                                className="card-img-top img-fluid galleryimg"
                                                alt="img"
                                                style={{
                                                    height: '250px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div className="card-body text-center">
                                                <small>{g.about}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default Gallery;
