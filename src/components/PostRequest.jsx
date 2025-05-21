import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, get, query, orderByChild } from "firebase/database";
import { validBloodGroups } from './constants';

const PostRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    neededBloodGroup: '',
    location: '',
    contactInfo: '',
  });

  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch IP address once on mount
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(err => console.error('IP fetch error:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validBloodGroups.includes(formData.neededBloodGroup)) {
      alert('❌ Please select a valid blood group.');
      return;
    }

    setLoading(true);
    const db = getDatabase();
    const emergencyRef = ref(db, 'emergency/');

    try {
      const snapshot = await get(query(emergencyRef, orderByChild('emergency/ip')));
      let lastSubmissionTime = 0;

      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const data = child.val().emergency;
          if (data.ip === ipAddress && data.timestamp > lastSubmissionTime) {
            lastSubmissionTime = data.timestamp;
          }
        });
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (now - lastSubmissionTime < oneHour) {
        const remaining = Math.ceil((oneHour - (now - lastSubmissionTime)) / 60000);
        alert(`⏱️ You can only submit 1 request per hour. Please wait ${remaining} more minute(s).`);
        setLoading(false);
        return;
      }

      // Submit request
      await push(emergencyRef, {
        emergency: {
          ...formData,
          ip: ipAddress,
          timestamp: now,
        },
      });

      alert('✅ Emergency request submitted!');
      setFormData({ patientName: '', neededBloodGroup: '', location: '', contactInfo: '' });
    } catch (err) {
      console.error('Submission error:', err);
      alert('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
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
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default PostRequest;
