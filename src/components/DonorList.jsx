import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [neededBloodGroups, setNeededBloodGroups] = useState([]);

  useEffect(() => {
    const db = getDatabase();

    // Fetch donors
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

    // Fetch emergency requests (filtering out expired ones)
    const emergencyRef = ref(db, 'emergency/');
    const emergencyUnsubscribe = onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val();
      const bloodGroups = [];

      const now = Date.now();
      const VALID_DURATION = 6 * 60 * 60 * 1000; // 6 hours

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

      setNeededBloodGroups([...new Set(bloodGroups)]); // Remove duplicates
    });

    // Cleanup
    return () => {
      donorsUnsubscribe();
      emergencyUnsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">Registered Donors</h2>

      {donors.length === 0 ? (
        <p>No donors registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => {
            const isMatch = neededBloodGroups.includes(donor.bloodGroup);

            return (
              <div
                key={donor.id}
                className={`border p-4 rounded shadow transition duration-300 ${
                  isMatch ? '' : 'blur-sm opacity-50'
                }`}
              >
                <p>
                  <strong>Name:</strong> {donor.name}
                </p>
                <p>
                  <strong>Blood Group:</strong> {donor.bloodGroup}
                </p>
                <p>
                  <strong>Location:</strong> {donor.location}
                </p>
                <p>
                  <strong>Phone:</strong> {donor.phone}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonorList;
