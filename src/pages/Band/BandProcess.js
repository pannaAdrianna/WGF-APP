import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
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


const raw = translations.types.raw;
export default function Band() {

  const {state} = useLocation();
  const navigate = useNavigate();


  const [mytimer, setMyTimer] = useState(10);

  const steps = [
    {
      label: 'Connect Headband',
      description: `Turn on bluetooth on headband and your device.\n
    Click on connect button to check the connection.
    `,
    },
    {
      label: 'Set up band (załóż)',
      description: '',

    },
    {
      label: 'Set up timer',
      description: `Czas badania licznik:` + { mytimer },

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

  const handleReset = () => {
    setActiveStep(0);
  };

  const startConnection = () => {
    console.log('Connection start');

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

  // data pulled out of multicast$
  const [introData, setIntroData] = useState(emptyAuxChannelData);

  const [rawData, setRawData] = useState(emptyAuxChannelData);

  // pipe settings
  const [rawSettings, setRawSettings] = useState(funRaw.getSettings);


  // connection status
  const [status, setStatus] = useState(connectionTranslations.connect);

  // for picking a new module
  const [selected, setSelected] = useState(raw);


  // for popup flag when recording
  const [recordPop, setRecordPop] = useState(false);
  const recordPopChange = useCallback(() => setRecordPop(!recordPop), [recordPop]);

  // for popup flag when recording 2nd condition
  const [recordTwoPop, setRecordTwoPop] = useState(false);
  const recordTwoPopChange = useCallback(() => setRecordTwoPop(!recordTwoPop), [recordTwoPop]);
  showAux = true;


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


  function startRecording() {


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
            { type: 'text/plain;charset=utf-8' },
          );
          saveAs(blob, rawSettings.name + '_Recording_' + Date.now() + '.csv');
          console.log('Completed');
        }
      });
    }

    console.log('Saving ' + mytimer + ' seconds...');
    var localObservable$ = null;
    const dataToSave = [];

    console.log('making ' + rawSettings.name + ' headers');


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

    //TODO Dodanie Input timer i zczytywanie z niego

    // Create timer
    const timer$ = timer(mytimer * 1000);

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
                        connect();
                      }}>Connect</Button>
                      :
                      <Typography variant='h5'>Connected with Muse</Typography>}
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
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
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
            <Typography>All steps completed - You can start now </Typography>
            <Button variant='contained' onClick={() => {
              setChartVisibility(true);
              startRecording();
              recordPopChange();

            }}>Start</Button>
            {chartVisibility && <Button
              destructive
              onClick={() => {
                console.log('stop');
                setRawData(emptyAuxChannelData);
              }}
              primary={status !== connectionTranslations.connect}
              disabled={status === connectionTranslations.connect}
            >
              Stop</Button>}
          </Paper>
        )
        }

        {chartVisibility ? (
          <React.Fragment>
            {pipeSettingsDisplay()}
            {renderModules()}
            {renderRecord()}
          </React.Fragment>
        ) : null
        }

      </Container>
    </Page>
  )
    ;

}
