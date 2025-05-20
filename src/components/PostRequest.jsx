import React, { useState } from 'react';
import { getDatabase, ref, push } from "firebase/database";
import { validBloodGroups } from './constants';

const PostRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    neededBloodGroup: '',
    location: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validBloodGroups.includes(formData.neededBloodGroup)) {
      alert('❌ Please select a valid blood group.');
      return;
    }

    const db = getDatabase();
    const emergencyRef = ref(db, 'emergency/');
    push(emergencyRef, {
      emergency: {
        ...formData,
        timestamp: Date.now(),
      },
    });

    alert('✅ Emergency request submitted!');
    setFormData({ patientName: '', neededBloodGroup: '', location: '', contactInfo: '' });
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

        <select
          name="neededBloodGroup"
          value={formData.neededBloodGroup}
          onChange={handleChange}
          required
          className="border p-2"
        >
          <option value="">Select Blood Group</option>
          {validBloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

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
