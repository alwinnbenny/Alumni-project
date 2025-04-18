

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { baseUrl } from '../../utils/globalurl';

const ManageJobs = ({ setHandleAdd }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("user_id");

  const [formData, setFormData] = useState({
    id: '',
    company: '',
    job_title: '',
    location: '',
    description: '',
    user_id: uid,
  });
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);

  useEffect(() => {
    if (location.state && location.state.action === 'edit') {
      setFormData(location.state.data);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (location.pathname.startsWith("/dashboard")) {
      navigate("/dashboard/jobs");
    } else {
      setHandleAdd(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);  // Show loader

    try {
      // Call API to post or edit the job
      if (location.state && location.state.action === 'edit') {
        await axios.put(`${baseUrl}auth/managejob`, formData);
      } else {
        await axios.post(`${baseUrl}auth/managejob`, formData);
      }

      // Reset the form data after successful submission
      setFormData({
        id: "",
        company: "",
        job_title: "",
        location: "",
        description: "",
        user_id: uid,
      });

      // Display success message after job posting
      toast.success('Job posted successfully!', {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error('Error:', error);
      // You can show a generic success message or handle this differently if required
      toast.error('An error occurred while posting the job.', {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);  // Hide loader
    }
  };

  const handleChangeDesc = (description) => {
    setFormData(prevState => ({
      ...prevState,
      description
    }));
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
              <ReactQuill
                value={formData.description}
                onChange={handleChangeDesc}
                required
              />
            </div>
          </div>
          <div className='col-md-8'>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-outline-danger float-end" onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ManageJobs;
