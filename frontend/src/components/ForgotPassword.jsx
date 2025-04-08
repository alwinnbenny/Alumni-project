import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}auth/forgot-password`, { email })
      .then((res) => toast.success(res.data.message))
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div className="container mt-5">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required className="form-control" />
        <button type="submit" className="btn btn-primary mt-3">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
