import React, { useState } from 'react';
import { getDatabase, ref, set, push } from "firebase/database";

const PostRequest = () => {
  const [fomData, setFormData] = useState({
    patientName: '',
    neededBloodGroup: '',
    location: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...fomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase();
    set(push(ref(db, 'emergency/')), {
      emergency: fomData 
    });

    // Placeholder: Handle the form data (send to API or log)
    console.log("Request submitted:", fomData);

    alert('Emergency request submitted!');
    
    // Optionally reset the form
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
          value={fomData.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
          className="border p-2"
        />
        <input
          name="neededBloodGroup"
          value={fomData.neededBloodGroup}
          onChange={handleChange}
          placeholder="Needed Blood Group"
          required
          className="border p-2"
        />
        <input
          name="location"
          value={fomData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="border p-2"
        />
        <input
          name="contactInfo"
          value={fomData.contactInfo}
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
