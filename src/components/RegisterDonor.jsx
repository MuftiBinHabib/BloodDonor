import React, { useState } from 'react';
import { getDatabase, ref, push } from "firebase/database";
import { validBloodGroups } from './constants';

const RegisterDonor = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validBloodGroups.includes(formData.bloodGroup)) {
      alert('❌ Please select a valid blood group.');
      return;
    }

    const db = getDatabase();
    push(ref(db, 'blooddonor/'), {
      blood: formData
    });

    alert("✅ Registered as a donor!");
    setFormData({ name: '', phone: '', bloodGroup: '', location: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">Register as a Donor</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="border p-2"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="border p-2"
        />
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
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
        <button type="submit" className="bg-red-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterDonor;
