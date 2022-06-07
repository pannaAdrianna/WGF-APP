import React, { useEffect, useRef, useState } from 'react';


import { v4 as uuidv4 } from 'uuid';


import { useAuth } from '../../auth/contexts/AuthContext';
import { Button, Grid, TextField } from '@material-ui/core';
import { Alert, IconButton, Stack } from '@mui/material';
import { db } from '../../../Firebase';
import { serverTimestamp, setDoc, addDoc, collection, doc, Timestamp, getFirestore } from 'firebase/firestore';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const PatientForm = () => {

    const { user } = useAuth();


    useEffect(() => {
      document.title = `Add New Patient`;
    });


    const [birthDay, setBirthDay] = useState(new Date());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    let [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [pesel, setPesel] = useState('');
    const [open, setOpen] = useState(true);
    const [errorType, setErrorType] = useState('error');
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {


      // eslint-disable-next-line
    }, []);


    const onSubmit = async (data) => {
      setLoading(true);
      console.log('on submit ', data);

      const owner = user ? user.uid : 'unknown';
      const ownerEmail = user ? user.email : 'unknown';


      let id = uuidv4();

      const newPatient = {
        name: data.name,
        surname: data.surname,
        pesel: data.pesel,
        id: id,
        owner,
        ownerEmail,
        birthDay,
        createdAt: serverTimestamp(),
        lastUpdate: serverTimestamp(),
        tests: doc(db, 'tests', (data.pesel)),


      };
      writePatient(newPatient);
      setLoading(false);
    };

    function writePatient(patient) {
      setDoc(doc(db, 'patients', (patient.pesel)), patient, { merge: true }).then
      ((r) => {
          setErrorType('success');
          setError(`Patient ${patient.pesel} added`);
          console.log('response', r);
        },
      );
    }

    return (


      <FormContainer
        onSuccess={onSubmit}
      >
        {error && <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          severity={errorType}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>}


        <Stack spacing={3}>
          <TextFieldElement id='name' name='name' label='First Name' required />
          <TextFieldElement id='surname' name='surname' label='Surname' required />
          <TextFieldElement id='pesel' name='pesel' label='Pesel' required />
          <Button fullWidth size='large' type='submit' variant='contained' onClick={handleSubmit}>
            Add
          </Button>
        </Stack>


      </FormContainer>
    );
  }
;

export default PatientForm;
