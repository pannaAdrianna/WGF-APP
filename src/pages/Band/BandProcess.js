import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MuseClient } from 'muse-js';
import { Button, Checkbox, Container, Grid, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, ButtonGroup } from '@shopify/polaris';


import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';


import Page from '../../components/Page';
import Card from '../../theme/overrides/Card';
import { PageSwitcher } from './PageSwitcher/PageSwitcher';
import { default as connectionTranslations } from './PageSwitcher/components/connectionStatesTranslations/en.json';
import { mockMuseEEG } from './PageSwitcher/utils/mockMuseEEG';
import { emptyAuxChannelData } from './PageSwitcher/components/chartOptions';
import * as funIntro from './PageSwitcher/components/EEGEduIntro/EEGEduIntro';
import * as funRaw from './PageSwitcher/components/EEGEduRaw/EEGEduRaw';
import { default as translations } from './PageSwitcher/pageSwitcherTranslations/en.json';
import { take, takeUntil } from 'rxjs/operators';
import { generateXTics } from './PageSwitcher/utils/chartUtils';
import { timer } from 'rxjs';
import { saveAs } from 'file-saver';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { fDateTimeSuffix, formatDate } from '../../utils/formatTime';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../Firebase';
import { useAuth } from '../../sections/auth/contexts/AuthContext';
import { Alert } from '@mui/lab';
import { TextField } from '@material-ui/core';


const raw = translations.types.raw;
export default function Band() {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();


  const [mytimer, setMyTimer] = useState(0.1);

  const steps = [
    {
      label: 'Connect Headband',
      description: `Turn on bluetooth on headband and your device.\n
    Click on connect button to check the connection.
    `,
    },
    {
      label: 'Set up band',
      description: '',

    },
    {
      label: `Set up timer: ${mytimer}`,
      description: `Timer: ${mytimer} min`,

    },
  ];


  const [activeStep, setActiveStep] = React.useState(0);


  const [chartVisibility, setChartVisibility] = useState(false);

  const handleNext = () => {

    if (status === connectionTranslations.connected) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else connect().then(r => {
      setStatus(connectionTranslations.connected);
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  // For auxEnable settings
  const [checked, setChecked] = useState(true);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);
  window.enableAux = checked;
  if (window.enableAux) {
    window.nchans = 5;
  } else {
    window.nchans = 4;
  }
  let showAux = true; // if it is even available to press (to prevent in some modules)


  const [rawData, setRawData] = useState(emptyAuxChannelData);

  // pipe settings
  const [rawSettings, setRawSettings] = useState(funRaw.getSettings);


  // connection status
  const [status, setStatus] = useState(connectionTranslations.connect);


  // for popup flag when recording
  const [recordPop, setRecordPop] = useState(false);
  const recordPopChange = useCallback(() => setRecordPop(!recordPop), [recordPop]);

  // for popup flag when recording 2nd condition
  const [recordTwoPop, setRecordTwoPop] = useState(false);
  showAux = true;

  const [statusPliku, setStatusPliku] = useState();
  const [errorType, setErrorType] = useState('info');
  const [progress, setProgress] = useState(0);
  useEffect(() => {


    // eslint-disable-next-line
  }, []);


  async function connect() {
    try {
      if (window.debugWithMock) {
        // Debug with Mock EEG Data
        setStatus(connectionTranslations.connectingMock);
        window.source = {};
        window.source.connectionStatus = {};
        window.source.connectionStatus.value = true;
        window.source.eegReadings$ = mockMuseEEG(256);
        setStatus(connectionTranslations.connectedMock);
      } else {
        // Connect with the Muse EEG Client
        setStatus(connectionTranslations.connecting);
        window.source = new MuseClient();
        window.source.enableAux = window.enableAux;
        await window.source.connect();
        await window.source.start();
        showAux = true;
        window.source.eegReadings$ = window.source.eegReadings;
        setStatus(connectionTranslations.connected);
      }
      if (
        window.source.connectionStatus.value === true &&
        window.source.eegReadings$
      ) {
        funRaw.buildPipe(rawSettings);
        funRaw.setup(setRawData, rawSettings);
      }
    } catch (err) {
      setStatus(connectionTranslations.connect);
      console.log('Connection error: ' + err);
    }
  }


  function refreshPage() {
    window.location.reload();
  }

  function pipeSettingsDisplay() {

    funRaw.renderSliders(setRawData, setRawSettings, status, rawSettings);

  }

  function renderModules() {

    return <funRaw.renderModule data={rawData} />;

  }

  function renderRecord() {
    funRaw.renderRecord(recordPopChange, recordPop, status, rawSettings, setRawSettings);
  }
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  // ADD FUNCTION
  async function addTest(myurl) {


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
    const lastUpdate = { lastUpdate: serverTimestamp() };

    addDoc(collection(db, `tests/${state.id}/tests`), updateData).then
    ((r) => {
        console.log('response', r);
      },
    ).catch((e) => {
      console.log(e);
    });


    setChartVisibility(false);

    setStatusPliku(`Data saved to storage for patient ${state.pesel}`);

    await timeout(2000);
    navigate('/dashboard/patients');


  }

  function handleTimerChange(event) {
    setMyTimer(event.target.value);
  };


  function startRecording() {
    async function uploadToStorage(file) {
      const storage = getStorage();
      let date = fDateTimeSuffix(Date.now());
      let name = `${state.id}_${date}.csv`;
      const storageRef = ref(storage, `tests/${state.id}/${name}`);
      const customMetadata = {
        contentType: 'data/csv',
        name: name,
        date: date,
      };

      const uploadTask = uploadBytesResumable(storageRef, file, { metadata: customMetadata });
      setStatusPliku('Done');

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
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            addTest(downloadURL);
          });
        },
      );



    };

    function timeout(delay) {
      return new Promise(res => setTimeout(res, delay));
    }


    function save() {


      // now with header in place subscribe to each epoch and log it
      localObservable$.subscribe({
        next(x) {
          dataToSave.push(Date.now() + ',' + Object.values(x).join(',') + '\n');
          // logging is useful for debugging -yup
          // console.log(x);
        },
        error(err) {
          console.log(err);
        },
        complete() {
          console.log('Trying to save');
          var blob = new Blob(
            dataToSave,
            { type: 'application/octet-stream' },
          );
          // saveAs(blob, rawSettings.name + '_Recording_' + Date.now() + '.csv');
          uploadToStorage(blob);

          console.log('Completed');
        },
      });
    }

    console.log('Saving ' + mytimer *60 + ' seconds...');
    var localObservable$ = null;
    const dataToSave = [];


    // for each module subscribe to multicast and make header
    // take one sample from selected observable object for headers
    localObservable$ = window.multicastRaw$.pipe(
      take(1),
    );
    //take one sample to get header info
    localObservable$.subscribe({
      next(x) {
        dataToSave.push(
          'Timestamp (ms),',
          generateXTics(x.info.samplingRate, x.data[0].length, false).map(function(f) {
            return 'ch0_' + f + 'ms';
          }) + ',',
          generateXTics(x.info.samplingRate, x.data[0].length, false).map(function(f) {
            return 'ch1_' + f + 'ms';
          }) + ',',
          generateXTics(x.info.samplingRate, x.data[0].length, false).map(function(f) {
            return 'ch2_' + f + 'ms';
          }) + ',',
          generateXTics(x.info.samplingRate, x.data[0].length, false).map(function(f) {
            return 'ch3_' + f + 'ms';
          }) + ',',
          generateXTics(x.info.samplingRate, x.data[0].length, false).map(function(f) {
            return 'chAux_' + f + 'ms';
          }) + ',',
          'info',
          '\n',
        );
      },
    });

    const timer$ = timer(mytimer * 1000 * 60);

    // put selected observable object into local and start taking samples
    localObservable$ = window.multicastRaw$.pipe(
      takeUntil(timer$),
    );


    save();


  }


  return (
    <Page title='Muse Connection'>
      <Container>

        <Typography variant='h4' gutterBottom>
          Reading from EEG Band for {state.pesel}
        </Typography>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant='caption'>Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                {activeStep === 0 ?
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    {status !== connectionTranslations.connected ?
                      <Button variant='contained' onClick={() => {
                        connect().then(r => {
                          console.log('connection', r);
                        });
                      }}>Connect</Button>
                      :
                      <Typography variant='h5'>Connected with Muse</Typography>}
                  </Paper>

                  : null
                }
                {activeStep === 2 ?
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <TextField
                      id='timer'
                      label='Timer [min]'
                      type='number'
                      defaultValue='1'
                      minValue='1'
                      onChange={(event) => handleTimerChange(event)}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Paper>
                  : null
                }

                <Box sx={{ mb: 2 }}>
                  <div>
                    {status === connectionTranslations.connected ?
                      <Button
                        variant='contained'
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Next
                      </Button>
                      : null
                    }
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Button variant='contained' onClick={() => {
              setChartVisibility(true);
              startRecording();
              recordPopChange();

            }}>Start recording</Button>
            {chartVisibility && <Button
              destructive
              onClick={() => {
                console.log('stop');

                setChartVisibility(false);
                setRawData(emptyAuxChannelData);
                setActiveStep(activeStep - 1);
              }}
              primary={status !== connectionTranslations.connect}
              disabled={status === connectionTranslations.connect}
            >
              Stop</Button>}
            {statusPliku ? <Alert severity={errorType}>{statusPliku}</Alert> : null}
          </Paper>
        )
        }
        {chartVisibility ?


          <React.Fragment>
            {pipeSettingsDisplay()}
            {renderModules()}
            {renderRecord()}
          </React.Fragment>
          : <React.Fragment>
            <p></p>
          </React.Fragment>}


      </Container>
    </Page>
  )
    ;

}
