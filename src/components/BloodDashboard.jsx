import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const DonorList = ({ neededBloodGroups }) => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const donorsRef = ref(db, 'blooddonor/');

    const unsubscribe = onValue(donorsRef, (snapshot) => {
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

    return () => unsubscribe();
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
            console.log(
              'Checking donor:',
              donor.bloodGroup,
              'against:',
              neededBloodGroups
            );

            return (
              <div
                key={donor.id}
                className={`border p-4 rounded shadow transition duration-300 ${
                  isMatch ? '' : 'blur-sm'
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

const EmergencyList = ({ setNeededBloodGroups }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const requestsRef = ref(db, 'emergency/');

    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRequests = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          loadedRequests.push({
            id: key,
            ...data[key].emergency,
          });
        });
      }

      setRequests(loadedRequests);

      // Extract unique blood groups and pass them up to the parent
      const bloodGroups = [
        ...new Set(
          loadedRequests.map((req) => req.neededBloodGroup)
        ),
      ];
      console.log('Collected blood groups from emergency:', bloodGroups);
      setNeededBloodGroups(bloodGroups);
    });

    return () => unsubscribe();
  }, [setNeededBloodGroups]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">Emergency Requests</h2>

      {requests.length === 0 ? (
        <p>No emergency requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow">
              <p>
                <strong>Patient:</strong> {req.patientName}
              </p>
              <p>
                <strong>Blood Group:</strong> {req.neededBloodGroup}
              </p>
              <p>
                <strong>Location:</strong> {req.location}
              </p>
              <p>
                <strong>Contact:</strong> {req.contactInfo}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BloodDashboard = () => {
  const [neededBloodGroups, setNeededBloodGroups] = useState([]);

  return (
    <div>
      <EmergencyList setNeededBloodGroups={setNeededBloodGroups} />
      <DonorList neededBloodGroups={neededBloodGroups} />
    </div>
  );
};

export default BloodDashboard;
