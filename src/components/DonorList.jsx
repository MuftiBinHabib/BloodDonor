import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [neededBloodGroups, setNeededBloodGroups] = useState([]);
  const [calledDonors, setCalledDonors] = useState(() => {
    const saved = localStorage.getItem('calledDonors');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const donorsRef = ref(db, 'blooddonor/');
    const donorsUnsubscribe = onValue(donorsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedDonors = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          loadedDonors.push({
            id: key,
            ...data[key].blood,
          });
        });
      }

      setDonors(loadedDonors);
    });

    const emergencyRef = ref(db, 'emergency/');
    const emergencyUnsubscribe = onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val();
      const bloodGroups = [];

      const now = Date.now();
      const VALID_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week

      if (data) {
        Object.keys(data).forEach((key) => {
          const emergency = data[key].emergency;
          if (
            emergency &&
            emergency.neededBloodGroup &&
            emergency.timestamp &&
            now - emergency.timestamp <= VALID_DURATION
          ) {
            bloodGroups.push(emergency.neededBloodGroup);
          }
        });
      }

      setNeededBloodGroups([...new Set(bloodGroups)]);
    });

    return () => {
      donorsUnsubscribe();
      emergencyUnsubscribe();
    };
  }, []);

  const handleCheckboxChange = (donorId) => {
    const updatedCalledDonors = calledDonors.includes(donorId)
      ? calledDonors.filter(id => id !== donorId)
      : [...calledDonors, donorId];

    setCalledDonors(updatedCalledDonors);
    localStorage.setItem('calledDonors', JSON.stringify(updatedCalledDonors));
  };

  const clearAllCalled = () => {
    setCalledDonors([]);
    localStorage.removeItem('calledDonors');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Registered Donors</h2>
        {calledDonors.length > 0 && (
          <button
            onClick={clearAllCalled}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Clear All Called
          </button>
        )}
      </div>

      {donors.length === 0 ? (
        <p>No donors registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => {
            const isMatch = neededBloodGroups.includes(donor.bloodGroup);
            const isCalled = calledDonors.includes(donor.id);

            return (
              <div
                key={donor.id}
                className={`border p-4 rounded shadow transition duration-300 ${
                  isMatch ? '' : 'blur-sm opacity-50'
                } ${isCalled ? 'bg-green-100' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{donor.name}</p>
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={isCalled}
                      onChange={() => handleCheckboxChange(donor.id)}
                      className="mr-2"
                    />
                    Called
                  </label>
                </div>
                <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                <p><strong>Location:</strong> {donor.location}</p>
                <p><strong>Phone:</strong> {donor.phone}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonorList;
