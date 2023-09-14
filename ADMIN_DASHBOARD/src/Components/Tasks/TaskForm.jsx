import React, { useState, useEffect } from 'react';
import { collection, addDoc,onSnapshot ,doc} from "firebase/firestore";
import { db } from "../../config/firebase";
import 'firebase/firestore';

export const TaskForm = () => {
  const [address, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [sameAsCompanyAddress,setSameAsCompanyAddress] = useState(false);

//   useEffect(() => {
//     // Fetch technicians and clients from Firestore
//     const fetchTechnicians = async () => {
//       const techniciansRef = collection('Technicians');
//       const techniciansSnapshot = await techniciansRef.get();
//       const technicianData = techniciansSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTechnicians(technicianData);
//     };

//     const fetchClients = async () => {
//       const clientsRef = collection('Clients');
//       const clientsSnapshot = await clientsRef.get();
//       const clientData = clientsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setClients(clientData);
//     };

//     fetchTechnicians();
//     fetchClients();
//   }, []);

  useEffect(() => {
    const technicianCollectionRef = collection(db, "Technicians");

    const unsubscribe = onSnapshot(technicianCollectionRef, (snapshot) => {
      const updatedTechnicians = [];
      snapshot.forEach((doc) => {
        updatedTechnicians.push({ ...doc.data(), id: doc.id });
      });
      setTechnicians(updatedTechnicians);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const clientCollectionRef = collection(db, "Clients");

    const unsubscribe = onSnapshot(clientCollectionRef, (snapshot) => {
      const updatedClients = [];
      snapshot.forEach((doc) => {
        updatedClients.push({ ...doc.data(), id: doc.id });
      });
      setClients(updatedClients);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    

    const taskData = {
      address,
      description,
      technician: doc(db,"Technicians",`${selectedTechnician}`),
      company: doc(db,"Clients",`${selectedClient}`),
      isArrived: false,
      isVerified: false
    };
    const jobsCollectionRef = collection(db, "Jobs");
    try {
      await addDoc(jobsCollectionRef,taskData);
      console.log('Task created successfully!');
      // You can also redirect the user or display a success message here
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address">Address</label>
          <input
            disabled={sameAsCompanyAddress}
            type="text"
            id="address"
            value={address}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
            <button onClick={(e)=>{
                    e.preventDefault();
                const theClient = clients.find(obj => obj.id===selectedClient);
                setTitle(theClient.address);
                setSameAsCompanyAddress(true);
            }}>Same As Company Address</button>
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="technician">Technician:</label>
          <select
            id="technician"
            value={selectedTechnician}
            onChange={e => setSelectedTechnician(e.target.value)}
            required
          >
            <option value="">Select a technician</option>
            {technicians.map(technician => (
              <option key={technician.id} value={technician.id}>
                {technician.firstName} {technician.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="client">Client:</label>
          <select
            id="client"
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

