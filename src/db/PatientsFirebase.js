import { useEffect, useRef, useState } from 'react';

function PatientsFirebase(){
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);


  const firebase = require("firebase");
  const ref = firebase.firestore().collection("patients");

  //REALTIME GET FUNCTION
  function getPatients() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setPatients(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getPatients();
    // eslint-disable-next-line
  }, []);


  // ADD FUNCTION
  function addPatient(newPatient) {
    ref
      //.doc() use if for some reason you want that firestore generates the id
      .doc(newPatient.id)
      .set(newPatient)
      .catch((err) => {
        console.error(err);
      });
  }

  //DELETE FUNCTION
  function deletePatient(patient) {
    ref
      .doc(patient.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  // EDIT FUNCTION
  function editPatient(patient) {
    // setLoading();
    ref
      .doc(patient.id)
      .update(patient)
      .catch((err) => {
        console.error(err);
      });
  }

}
