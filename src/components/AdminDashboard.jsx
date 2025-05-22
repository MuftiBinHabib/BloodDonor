import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const AdminDashboard = () => {
  const [donors, setDonors] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const SECRET_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (!isAuthenticated) return;

    const db = getDatabase();
    const donorsRef = ref(db, 'blooddonor/');

    onValue(donorsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase blooddonor data:', data);

      if (data) {
        const donorList = Object.entries(data).map(([id, val]) => {
          console.log('Donor:', id, val);
          return { id, ...val.blood };  // Unwrapping the nested blood object here
        });
        setDonors(donorList);
      } else {
        setDonors([]);
      }
    });
  }, [isAuthenticated]);

  const handleApprove = (id) => {
    const db = getDatabase();
    update(ref(db, `blooddonor/${id}`), { approved: true });
  };

  const handleBan = (id) => {
    const db = getDatabase();
    update(ref(db, `blooddonor/${id}`), { banned: true });
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
      <ul className="space-y-4">
        {donors.map((donor) => (
          <li key={donor.id} className="border p-4 rounded shadow">
            <p><strong>Name:</strong> {donor.name || 'N/A'}</p>
            <p><strong>Blood Group:</strong> {donor.bloodGroup || 'N/A'}</p>
            <p><strong>Location:</strong> {donor.location || 'N/A'}</p>
            <p><strong>Phone:</strong> {donor.phone || 'N/A'}</p>
            <p>
              <strong>Status:</strong> {donor.approved ? '✅ Approved' : '❌ Pending'} {donor.banned && '🚫 Banned'}
            </p>
            <button
              onClick={() => handleApprove(donor.id)}
              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
            >
              Approve
            </button>
            <button
              onClick={() => handleBan(donor.id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Ban
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
