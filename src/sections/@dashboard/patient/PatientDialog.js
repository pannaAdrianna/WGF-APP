import PatientCard from './PatientCard';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, IconButton, Button, Card, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../Firebase';
import { doc, getDoc } from 'firebase/firestore';

const PatientDialog = (props) => {
  const { onClose, open, pesel } = props;
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState({});

  const docRef = doc(db, 'patients', pesel);


  async function getPatient() {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setSelectedPatient({
        pesel: docSnap.data().pesel,
        name: docSnap.data().name,
        surname: docSnap.data().surname,
        birthDay: docSnap.data().birthDay,
        tests: docSnap.data().tests,
      });


    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  useEffect(() => {
    console.log('Patients Dialog props');
    console.log(props);
    getPatient()
    // let pat = new Patient(select)


    // eslint-disable-next-line
  }, []);


  let year = new Date().getFullYear();
  let datePattern = 'dd.MM.yyyy';

  getPatient()
  return (
    <Dialog open={open} onClose={onClose}>
      <IconButton style={{ color: 'grey', background: 'white' }} onClick={onClose}>
        <CloseIcon onClick={onClose} />
      </IconButton>
      <DialogContent style={{ padding: 10, alignItems: 'center', gap: 10 }} >
        <DialogTitle>Patient Info {pesel}</DialogTitle>

        <PatientCard patient={selectedPatient} />

        {/*<Button*/}
        {/*        onClick={() => navigate('/eeg-test', {patient: selectedPatient})}>Add New*/}
        {/*    Test</Button>*/}

        {/*<Card>*/}
        {/*    <h1>Patient's Tests</h1>*/}
        {/*    /!*<PatientTestTable pesel={selectedPatient.pesel}/>*!/*/}
        {/*</Card>*/}
        {/*< >*/}
        {/*    /!*<Button className={classes.button} style={{background: 'darkgreen'}}>Save</Button>*!/*/}

        {/*</>*/}
      </DialogContent>
    </Dialog>
  );
};

PatientDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pesel: PropTypes.string.isRequired,
};
export default PatientDialog;
