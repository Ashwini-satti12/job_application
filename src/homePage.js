import React, { useState } from 'react';
import axios from 'axios';
import './home.css';

const HomePage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    work_experience: '',
    source: '',
    jobid: '',
    status: '',
    interviewdate: '',
    interviewlink: '',
    company_id: '',
    cost: '',
    status1: '',
  });

  const [resume, setResume] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resume_path') {
      setResume(files[0]);
    } else if (name === 'offer_letter') {
      setOfferLetter(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    if (resume) payload.append('resume_path', resume);
    if (offerLetter) payload.append('offer_letter', offerLetter);

    try {
      const response = await axios.post(' http://127.0.0.1:5000/submit', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Job Application</h2>
      <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
        <div className="input-group">
          <input type="text" name="full_name" placeholder="Full Name" className="input-field" value={formData.full_name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="input-field" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input type="text" name="phone" placeholder="Phone" className="input-field" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" className="input-field" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input type="text" name="work_experience" placeholder="Work Experience" className="input-field" value={formData.work_experience} onChange={handleChange} />
          <input type="text" name="source" placeholder="Source" className="input-field" value={formData.source} onChange={handleChange} />
        </div>
        <div className="input-group">
          <input type="text" name="jobid" placeholder="Job ID" className="input-field" value={formData.jobid} onChange={handleChange} />
          <input type="text" name="status" placeholder="Status" className="input-field" value={formData.status} onChange={handleChange} />
        </div>
        <div className="input-group">
          <input type="date" name="interviewdate" className="input-field" value={formData.interviewdate} onChange={handleChange} />
          <input type="text" name="interviewlink" placeholder="Interview Link" className="input-field" value={formData.interviewlink} onChange={handleChange} />
        </div>
        <div className="input-group">
          <input type="text" name="company_id" placeholder="Company ID" className="input-field" value={formData.company_id} onChange={handleChange} />
          <input type="text" name="cost" placeholder="Cost" className="input-field" value={formData.cost} onChange={handleChange} />
        </div>
        <div className="input-group">
          <input type="text" name="status1" placeholder="Status 1" className="input-field" value={formData.status1} onChange={handleChange} />
        </div>

        <div className="file-group">
          <label>
            Upload Resume (PDF)
            <input type="file" name="resume_path" accept=".pdf" onChange={handleFileChange} required />
          </label>
          <label>
            Upload Offer Letter (PDF)
            <input type="file" name="offer_letter" accept=".pdf" onChange={handleFileChange} required />
          </label>
        </div>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  );
};

export default HomePage;
