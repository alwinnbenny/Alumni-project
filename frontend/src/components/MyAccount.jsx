import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    const navigate = useNavigate(); // add this

    const [acc, setAcc] = useState({
        name: '',
        connected_to: "",
        current_location: "",
        course_id: "",
        email: "",
        gender: "",
        password: "",
        batch: "",
        phone: "",
        linkedin_url: "",
        company_url: "",
    });
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const alumnus_id = localStorage.getItem("alumnus_id");
        const fetchData = async () => {
            try {
                const alumnusDetailsRes = await axios.get(`${baseUrl}auth/alumnusdetails?id=${alumnus_id}`);
                const coursesRes = await axios.get(`${baseUrl}auth/courses`);

                setAcc(alumnusDetailsRes.data.length > 0 ? alumnusDetailsRes.data[0] : {
                    name: '', connected_to: '', current_location: '', course_id: '', email: '', gender: '', password: '', batch: '', phone: '', linkedin_url: '', company_url: ''
                });
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load account details');
            }
        };
        if (alumnus_id) fetchData();
    }, []);

    const handleChange = (e) => {
        setAcc({ ...acc, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const alumnus_id = localStorage.getItem("alumnus_id");
        const user_id = localStorage.getItem("user_id");
        const pswrd = document.getElementById("pswrd").value;

        try {
            const formData = new FormData();
            if (file) {
                formData.append('image', file);
            }
            formData.append('name', acc.name);
            formData.append('connected_to', acc.connected_to);
            formData.append('current_location', acc.current_location);
            formData.append('course_id', acc.course_id);
            formData.append('email', acc.email);
            formData.append('gender', acc.gender);
            formData.append('password', pswrd);
            formData.append('batch', acc.batch);
            formData.append('phone', acc.phone || "");
            formData.append('linkedin_url', acc.linkedin_url || "");
            formData.append('company_url', acc.company_url || "");
            formData.append('alumnus_id', alumnus_id);
            formData.append('user_id', user_id);

            const response = await axios.put(`${baseUrl}auth/upaccount`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);
              setTimeout(() => {
            navigate('/');
        }, 2000); 
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error:', error);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Manage Account</h3>
                            <FaStar className='text-white ' />
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>
            <section className="page-section bg-dark text-white mb-0" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <form onSubmit={handleSubmit} className="form-horizontal">

                                {/* Name */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="text" className="form-control" name="name" required value={acc.name} />
                                    </div>
                                </div>

                                {/* Gender + Batch */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Gender</label>
                                    <div className="col-sm-4">
                                        <select onChange={handleChange} className="form-control" name="gender" required value={acc.gender}>
                                            <option disabled value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <label className="col-sm-2 col-form-label">Batch</label>
                                    <div className="col-sm-4">
                                        <input onChange={handleChange} type="text" className="form-control" name="batch" required value={acc.batch} />
                                    </div>
                                </div>

                               <div className="form-group row">
  <label className="col-sm-2 col-form-label">Course Graduated</label>
  <div className="col-sm-10">
    <select 
      onChange={handleChange} 
      className="form-control select2" 
      name="course_id" 
      required 
      value={acc.course_id ? acc.course_id.toString() : ""}
    >
      <option disabled value="">Select course</option>
      {courses.map(c => (
        <option key={c.id} value={c.id.toString()}>
          {c.course}
        </option>
      ))}
    </select>
  </div>
</div>

                                {/* Connected To + Location */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Currently Connected To</label>
                                    <div className="col-sm-10">
                                        <textarea onChange={handleChange} name="connected_to" className="form-control" rows="2" value={acc.connected_to}></textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Current Location</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="text" className="form-control" name="current_location" placeholder="Enter your current location" value={acc.current_location || ""} />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Phone Number</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="text" className="form-control" name="phone" placeholder="Enter phone number (Enter dummy number like 123 to stay private )" value={acc.phone || ""} />
                                    </div>
                                </div>

                                {/* LinkedIn URL (optional) */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">LinkedIn Profile</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="url" className="form-control" name="linkedin_url" placeholder="LinkedIn profile link (add https:// in the beginning of url)" value={acc.linkedin_url || ""} />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="email" className="form-control" name="email" required value={acc.email} />
                                    </div>
                                </div>
                                {/* Company URL (optional) */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Company URL</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="url" className="form-control" name="company_url" placeholder="Currently connected company's URL" value={acc.company_url || ""} />
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Profile Picture</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleFileChange} type="file" className="form-control-file" name="avatar" />
                                    </div>
                                </div>


                                {/* Password */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} id='pswrd' type="password" className="form-control" name="password" placeholder="Enter new password (optional)" />
                                        <small className="form-text text-info fst-italic">Leave blank if you don’t want to change your password</small>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <button type='submit' className="btn btn-secondary">Update Account</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyAccount;
