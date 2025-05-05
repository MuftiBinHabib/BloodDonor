import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import DonorList from './DonorList';
import EmergencyList from './EmergencyList';

const Dashboard = () => {
  const [neededBloodGroups, setNeededBloodGroups] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const requestsRef = ref(db, 'emergency/');

    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const bloodGroups = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          const emergency = data[key].emergency;
          if (emergency?.neededBloodGroup) {
            bloodGroups.push(emergency.neededBloodGroup);
          }
        });
      }

      setNeededBloodGroups(bloodGroups);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <EmergencyList />
      <DonorList neededBloodGroups={neededBloodGroups} />
    </div>
  );
};

export default Dashboard;
