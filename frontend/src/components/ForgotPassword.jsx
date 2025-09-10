// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { baseUrl } from '../utils/globalurl';
// // import { toast } from 'react-toastify';

// // const ForgotPassword = () => {
// //   const [email, setEmail] = useState('');

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     axios.post(`${baseUrl}auth/forgot-password`, { email })
// //       .then((res) => toast.success(res.data.message))
// //       .catch((err) => toast.error(err.response.data.message));
// //   };

// // //   return (
// // //     <div className="container mt-29">
// // //       <div className="mt-10"> {/* Adds extra space above the heading */}
// // //       <div className="mt-5"> {/* Adds extra space above the heading */}
// // //       <div className="mt-5"> {/* Adds extra space above the heading */}
// // //       <h3>Forgot Password</h3>
// // //       <form onSubmit={handleSubmit}>
// // //         <input type="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required className="form-control" />
// // //         <button type="submit" className="btn btn-primary mt-3">Send Reset Link</button>
// // //       </form>
// // //     </div>
// // //     </div>
// // //     </div>
// // //     </div>
// // //   );
// // // };

// // return (
// //   <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
// //     <div className="text-center">
// //       <h3 className="mb-3">Forgot Password</h3>
// //       <p className="mb-4">Please enter your email address below, and we’ll send you a link to reset your password.</p>
// //       <form onSubmit={handleSubmit}>
// //         <input 
// //           type="email" 
// //           placeholder="Enter your email" 
// //           onChange={e => setEmail(e.target.value)} 
// //           required 
// //           className="form-control mb-3" 
// //         />
// //         <button type="submit" className="btn btn-primary">Send Reset Link</button>
// //       </form>
// //     </div>
// //   </div>
// // );
// // };

// // export default ForgotPassword;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { baseUrl } from '../utils/globalurl';
// import { toast } from 'react-toastify';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post(`${baseUrl}auth/forgot-password`, { email })
//       .then((res) => toast.success(res.data.message))
//       .catch((err) => toast.error(err.response.data.message));
//   };

// //   return (
// //     <div className="container mt-29">
// //       <div className="mt-10"> {/* Adds extra space above the heading */}
// //       <div className="mt-5"> {/* Adds extra space above the heading */}
// //       <div className="mt-5"> {/* Adds extra space above the heading */}
// //       <h3>Forgot Password</h3>
// //       <form onSubmit={handleSubmit}>
// //         <input type="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required className="form-control" />
// //         <button type="submit" className="btn btn-primary mt-3">Send Reset Link</button>
// //       </form>
// //     </div>
// //     </div>
// //     </div>
// //     </div>
// //   );
// // };

// return (
//   <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//     <div className="text-center">
//       <h3 className="mb-3">Forgot Password</h3>
//       <p className="mb-4">Please enter your email address below, and we’ll send you a link to reset your password.</p>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="email" 
//           placeholder="Enter your email" 
//           onChange={e => setEmail(e.target.value)} 
//           required 
//           className="form-control mb-3" 
//         />
//         <button type="submit" className="btn btn-primary">Send Reset Link</button>
//       </form>
//     </div>
//   </div>
// );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/globalurl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post(`${baseUrl}auth/forgot-password`, { email })
      .then((res) => {
        toast.success("Mail sent! Check your mail ID");
        setEmail(''); // Clear input after success
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || "Something went wrong";
        toast.error(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <h3 className="mb-3">Forgot Password</h3>
          <p className="mb-4">Please enter your email address below, and we’ll send you a link to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-control mb-3"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default ForgotPassword;
