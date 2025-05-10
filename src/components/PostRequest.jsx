import React, { useState } from 'react';
import { getDatabase, ref, push } from "firebase/database"; // ✅ `set` not needed

const PostRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    neededBloodGroup: '',
    location: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // ✅ typo fixed: fomData ➜ formData
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase();
    const emergencyRef = ref(db, 'emergency/');

    // ✅ Push form data with timestamp
    push(emergencyRef, {
      emergency: {
        ...formData,
        timestamp: Date.now(), // ⏰ add timestamp here
      },
    });

    alert('Emergency request submitted!');

    // Clear form
    setFormData({
      patientName: '',
      neededBloodGroup: '',
      location: '',
      contactInfo: '',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">Post an Emergency</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
          className="border p-2"
        />
        <input
          name="neededBloodGroup"
          value={formData.neededBloodGroup}
          onChange={handleChange}
          placeholder="Needed Blood Group"
          required
          className="border p-2"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="border p-2"
        />
        <input
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="Contact Info"
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default PostRequest;
