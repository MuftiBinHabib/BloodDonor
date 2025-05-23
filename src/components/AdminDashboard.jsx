import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const AdminDashboard = () => {
  const [donors, setDonors] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const SECRET_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (!isAuthenticated) return;

    const db = getDatabase();

    // Load donors
    const donorsRef = ref(db, 'blooddonor/');
    onValue(donorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const donorList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val.blood,
        }));
        setDonors(donorList);
      } else {
        setDonors([]);
      }
    });

    // Load emergency requests
    const emergencyRef = ref(db, 'emergency/');
    onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const emergencyList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val.emergency,
        }));
        setEmergencies(emergencyList);
      } else {
        setEmergencies([]);
      }
    });
  }, [isAuthenticated]);

  const handleApprove = (id, path) => {
    const db = getDatabase();
    update(ref(db, `${path}/${id}`), { approved: true });

    if (path === 'blooddonor') {
      setDonors((prev) => prev.filter((d) => d.id !== id));
    } else if (path === 'emergency') {
      setEmergencies((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleBan = (id, path) => {
    const db = getDatabase();
    update(ref(db, `${path}/${id}`), { banned: true });

    if (path === 'blooddonor') {
      setDonors((prev) => prev.filter((d) => d.id !== id));
    } else if (path === 'emergency') {
      setEmergencies((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleLogin = () => {
    if (adminPass === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Enter Admin Password"
          value={adminPass}
          onChange={(e) => setAdminPass(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donor List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Donors</h2>
          <ul className="space-y-4">
            {donors.map((donor) => (
              <li key={donor.id} className="border p-4 rounded shadow">
                <p><strong>Name:</strong> {donor?.name ?? 'N/A'}</p>
                <p><strong>Blood Group:</strong> {donor?.bloodGroup ?? 'N/A'}</p>
                <p><strong>Location:</strong> {donor?.location ?? 'N/A'}</p>
                <p><strong>Phone:</strong> {donor?.phone ?? 'N/A'}</p>
                <p>
                  <strong>Status:</strong> {donor?.approved ? '✅ Approved' : '❌ Pending'} {donor?.banned && '🚫 Banned'}
                </p>
                <button
                  onClick={() => handleApprove(donor.id, 'blooddonor')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBan(donor.id, 'blooddonor')}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Ban
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Emergency Requests</h2>
          <ul className="space-y-4">
            {emergencies.map((emergency) => (
              <li key={emergency.id} className="border p-4 rounded shadow">
                <p><strong>Patient Name:</strong> {emergency?.patientName ?? 'N/A'}</p>
                <p><strong>Needed Blood Group:</strong> {emergency?.neededBloodGroup ?? 'N/A'}</p>
                <p><strong>Location:</strong> {emergency?.location ?? 'N/A'}</p>
                <p><strong>Contact Info:</strong> {emergency?.contactInfo ?? 'N/A'}</p>
                <p><strong>IP:</strong> {emergency?.ip ?? 'N/A'}</p>
                <p>
                  <strong>Status:</strong> {emergency?.approved ? '✅ Approved' : '❌ Pending'} {emergency?.banned && '🚫 Banned'}
                </p>
                <button
                  onClick={() => handleApprove(emergency.id, 'emergency')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBan(emergency.id, 'emergency')}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Ban
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
