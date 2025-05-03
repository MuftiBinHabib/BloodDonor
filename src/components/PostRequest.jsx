// import React, { useState } from 'react';


// const PostRequest = () => {
//   const [formData, setFormData] = useState({
//     patientName: '',
//     neededBloodGroup: '',
//     location: '',
//     contactInfo: ''
//   });
//   const [matches, setMatches] = useState([]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, "requests"), {
//         ...formData,
//         createdAt: serverTimestamp(),
//       });

//       // Find matching donors
//       const q = query(
//         collection(db, "donors"),
//         where("bloodGroup", "==", formData.neededBloodGroup),
//         where("location", "==", formData.location)
//       );

//       const querySnapshot = await getDocs(q);
//       const found = [];
//       querySnapshot.forEach((doc) => {
//         found.push(doc.data());
//       });
//       setMatches(found);

//       alert("Emergency request posted!");
//     } catch (error) {
//       console.error("Error posting request:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl mb-4 font-bold">Post an Emergency</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           name="patientName"
//           value={formData.patientName}
//           onChange={handleChange}
//           placeholder="Patient Name"
//           required
//           className="border p-2"
//         />
//         <input
//           name="neededBloodGroup"
//           value={formData.neededBloodGroup}
//           onChange={handleChange}
//           placeholder="Needed Blood Group"
//           required
//           className="border p-2"
//         />
//         <input
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="Location"
//           required
//           className="border p-2"
//         />
//         <input
//           name="contactInfo"
//           value={formData.contactInfo}
//           onChange={handleChange}
//           placeholder="Contact Info"
//           required
//           className="border p-2"
//         />
//         <button type="submit" className="bg-blue-500 text-white py-2 rounded">
//           Submit Request
//         </button>
//       </form>

//       {matches.length > 0 && (
//         <div className="mt-8">
//           <h3 className="text-xl font-bold mb-2">Matching Donors:</h3>
//           <ul className="list-disc list-inside">
//             {matches.map((donor, idx) => (
//               <li key={idx}>
//                 {donor.name} - {donor.phone}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostRequest;
