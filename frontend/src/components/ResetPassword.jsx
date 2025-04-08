import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}auth/reset-password/${token}`, { password })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div className="container mt-5">
      <h3>Reset Password</h3>
      <form onSubmit={handleReset}>
        <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} required className="form-control" />
        <button type="submit" className="btn btn-success mt-3">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
