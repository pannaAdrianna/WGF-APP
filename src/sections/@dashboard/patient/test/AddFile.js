import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Grid, Stack, Typography, CircularProgress, Input } from '@mui/material';


import Page from '../../../../components/Page';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/contexts/AuthContext';
import { db } from '../../../../Firebase';
import { Alert } from '@mui/lab';
import { Box } from '@material-ui/core';
import { ref, uploadBytes, uploadBytesResumable, getStorage } from 'firebase/storage';
import { styled } from '@mui/material/styles';
import { fDate, fDateTimeSuffix } from '../../../../utils/formatTime';

export default function AddFile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState(false);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [pesel, setPesel] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');


  useEffect(() => {
    document.title = `Select File`;

    console.log('Select File. Location state patient pesel', state.pesel);
    setPesel(state.pesel);
    console.log('Select File pesel', pesel);

  }, []);

  const handleChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }

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

  // ADD FUNCTION
  function addTest(myurl) {


    const owner = user ? user.uid : 'unknown';
    const ownerEmail = user ? user.email : 'unknown';

    const newTest = {
      id: uuidv4(),
      url: myurl,
      owner,
      ownerEmail,
      createdAt: serverTimestamp(),
    };

    const updateData = { tests: newTest };
    /* ref
       .doc(`${pesel}`).collection(`tests`)
       .add(updateData, { merge: true })
       .catch((err) => {
         console.error(err);
       });
     const lastUpdate = { lastUpdate: serverTimestamp() };
     ref.doc(`${pesel}`).set(lastUpdate, { merge: true });*/

    // refPatients.doc(`${pesel}`).
    addDoc(doc(db, `tests/${pesel}/tests`), updateData, { merge: true }).then
    ((r) => {
        // setErrorType('success');
        // setError(`Patient ${patient.pesel} added`);
        console.log('response', r);
      },
    ).catch((e) => {
      console.log(e);
    });

    setError(`Data added to patient: ${pesel}`);


  }

  const handleUpload = () => {
    const storage = getStorage();
    let date=fDateTimeSuffix(file.lastModifiedDate);

    let fileName=`${pesel}_${date}.edf`;
    const storageRef = ref(storage, `${pesel}/${fileName}`);



    const customMetadata = {
      contentType: 'data/edf',
      name: `${fileName}`,
      type: 'edf'
    };

    const uploadTask = uploadBytesResumable(storageRef, file,{customMetadata});


    console.log('PLIK: ', file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      async () => {


        storage
          .ref(`patients/${pesel}`)
          .child(file.name)
          .getDownloadURL()
          .then(url => {
              setUrl(url);
              addTest(url);
            },
          );

      },
    );


  };


  function handleClick() {
    setFileStatus(true); // pokazuje card
    console.log('click');

  }


  const Input = styled('input')({
    display: 'none',
  });

  function CircularProgressWithLabel(props) {
    return (
      <Stack direction='row'>
        <CircularProgress variant='determinate' {...props} />
        <Typography variant='caption' component='div' color='text.secondary'>
          {`${Math.round(props.value)}%`}
        </Typography>

      </Stack>
    );
  }

  return (
    <Page title='Add File: EEG'>
      <Container>


        <Card sx={{ padding: 2 }}>
          <Typography variant='h4' sx={{ mb: 5 }}>
            Upload File {pesel}
          </Typography>


          {error && <Alert severity={errorType}>{error}</Alert>}

          {progress === 100 ?
            <div>
              <p>File uploaded to database</p>
              <Button onClick={handleClick} variant='contained'>Visualize</Button>
            </div>
            :
            <>
              <Stack direction='column' sx={{ padding: 1 }}>

                    <span>
                    {/*<progress value={progress} max="100"/>*/}
                      <CircularProgressWithLabel value={progress} />
                    </span>

                <input type='file' accept='.edf' onChange={handleChange} />

              </Stack>
              {file ?
                <Button variant='contained' size='small' onClick={handleUpload}>Upload file to database</Button>
                : null
              }

            </>


          }
        </Card>


        {/* {fileStatus ?
          <div>
            <Card>
              <VisualizeEDFfile file={'dane Pliku'} />
            </Card>
          </div> : <></>}*/}

      </Container>
    </Page>


  )
    ;

}
