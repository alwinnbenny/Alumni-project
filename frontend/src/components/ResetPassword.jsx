// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { baseUrl } from '../utils/globalurl';
// import { toast } from 'react-toastify';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleReset = (e) => {
//     e.preventDefault();
//     axios.post(`${baseUrl}auth/reset-password/${token}`, { password })
//       .then((res) => {
//         toast.success(res.data.message);
//         navigate("/login");
//       })
//       .catch((err) => toast.error(err.response.data.message));
//   };

//   return (
//     <div className="container mt-5">
//       <h3>Reset Password</h3>
//       <form onSubmit={handleReset}>
//         <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} required className="form-control" />
//         <button type="submit" className="btn btn-success mt-3">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // eye icons

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    axios.post(`${baseUrl}auth/reset-password/${token}`, { password })
      .then((res) => {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div 
        className="container-fluid d-flex justify-content-center align-items-center" 
        style={{ height: '100vh' }}
      >
        <div className="text-center p-4 border rounded" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
          <h3 className="mb-3">Reset Password</h3>
          <p className="mb-4">Enter your new password...</p>
          <form onSubmit={handleReset}>
            {/* Password input with toggle */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-control"
              />
              <span 
                className="position-absolute" 
                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {/* Confirm password input with toggle */}
            <div className="mb-3 position-relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="form-control"
              />
              <span 
                className="position-absolute" 
                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowConfirm(prev => !prev)}
              >
                {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-success w-100" 
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default ResetPassword;
