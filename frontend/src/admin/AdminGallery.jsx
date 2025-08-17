import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [file, setFile] = useState(null);
  const [about, setAbout] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  // Generate a range of years dynamically (e.g., from 1980 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: (currentYear) - 1980 + 1 }, (_, i) => 1980 + i);

  useEffect(() => {
    axios.get(`${baseUrl}auth/gallery`)
      .then((res) => {
        // Sort by end year descending
        const sortedData = res.data.sort((a, b) => (b.end_year || 0) - (a.end_year || 0));
        setGallery(sortedData);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleAboutChange = (e) => setAbout(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!startYear || !endYear) {
      toast.error("Please select both start and end years");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('about', about);
      formData.append('start_year', startYear);
      formData.append('end_year', endYear);

      const response = await axios.post(`${baseUrl}auth/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(response.data.message);
      setGallery(prev => [...prev, response.data].sort((a, b) => (b.end_year || 0) - (a.end_year || 0)));
      setFile(null);
      setAbout('');
      setStartYear('');
      setEndYear('');
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}auth/gallery/${id}`);
      setGallery(gallery.filter(item => item.id !== id));
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const shortenAboutText = (text, maxLength) =>
    text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  return (
    <div className="container-fluid">
      <ToastContainer position="top-center" />
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <form onSubmit={handleSubmit} id="manage-gallery">
            <div className="card">
              <div className="card-header">Upload</div>
              <div className="card-body">
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" className="form-control" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                  <label>Short Description</label>
                  <textarea className="form-control" value={about} onChange={handleAboutChange}></textarea>
                </div>
                <div className="form-group">
                  <label>Start Year</label>
                  <select className="form-control" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                    <option value="">Select</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>End Year</label>
                  <select className="form-control" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                    <option value="">Select</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
              <div className="card-footer">
                <div className="row">
                  <div className="col-md-6">
                    <button type="submit" className="btn btn-sm btn-primary btn-block">Save</button>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-sm btn-default btn-block" type="button">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-8 col-md-12">
          <div className="card">
            <div className="card-header"><b>Gallery List</b></div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Image</th>
                      <th className="text-center">About</th>
                      <th className="text-center">Batch</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gallery.map((g, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td><img src={`${baseUrl}${g.image_path}`} className="gimg" alt="img" /></td>
                        <td>{shortenAboutText(g.about, 30)}</td>
                        <td className="text-center">
                          {g.start_year && g.end_year ? `${g.start_year} - ${g.end_year}` : 'N/A'}
                        </td>
                        <td className="text-center">
                          <div className='d-flex'>
                            <button onClick={() => handleDelete(g.id)} className="btn btn-sm btn-danger" type="button">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGallery;
