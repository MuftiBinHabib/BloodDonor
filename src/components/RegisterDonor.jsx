import React, { useState } from 'react';
import firebaseConfig from './firebase';
import { getDatabase, ref, set , push } from "firebase/database";

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
    // ✅ Simulate saving to a backend
    const db = getDatabase();
  set(push(ref(db, 'blooddonor/' )), {
    blood:formData
  });
    alert("✅ (Simulated) Registered as a donor! Check console for data.");
    // Reset form
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
        <input
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Blood Group (e.g., A+)"
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
        <button type="submit" className="bg-red-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterDonor;
