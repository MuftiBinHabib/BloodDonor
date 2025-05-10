import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

const EmergencyList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const requestsRef = ref(db, 'emergency/');

    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRequests = [];
      const now = Date.now();
      const VALID_DURATION = 6 * 1000; // 6 seconds

      if (data) {
        Object.keys(data).forEach((key) => {
          const request = data[key].emergency;
          const timestamp = request?.timestamp;

          if (timestamp && now - timestamp <= VALID_DURATION) {
            loadedRequests.push({
              id: key,
              ...request,
            });
          } else if (timestamp) {
            // ❌ Delete expired request from database
            const expiredRef = ref(db, `emergency/${key}`);
            remove(expiredRef);
          }
        });
      }

      setRequests(loadedRequests);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">Emergency Requests</h2>

      {requests.length === 0 ? (
        <p>No emergency requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow">
              <p><strong>Patient:</strong> {req.patientName}</p>
              <p><strong>Blood Group:</strong> {req.neededBloodGroup}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Contact:</strong> {req.contactInfo}</p>
              <p><strong>Posted:</strong> {new Date(req.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyList;
