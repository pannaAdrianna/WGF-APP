import React, { useState, useCallback } from 'react';
import { MuseClient } from 'muse-js';
import { Select, Card, Stack, ButtonGroup } from '@shopify/polaris';

import { mockMuseEEG } from './utils/mockMuseEEG';
import { default as translations } from './pageSwitcherTranslations/en.json';
import { default as connectionTranslations } from './components/connectionStatesTranslations/en.json';
import { emptyAuxChannelData } from './components/chartOptions';

import * as funIntro from './components/EEGEduIntro/EEGEduIntro';
import * as funRaw from './components/EEGEduRaw/EEGEduRaw';
import { Button, Checkbox } from '@mui/material';


const intro = translations.types.intro;

const raw = translations.types.raw;

export function PageSwitcher() {

  // For auxEnable settings
  const [checked, setChecked] = useState(false);
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
  const [introSettings] = useState(funIntro.getSettings);

  const [rawSettings, setRawSettings] = useState(funRaw.getSettings);


  // connection status
  const [status, setStatus] = useState(connectionTranslations.connect);

  // for picking a new module
  const [selected, setSelected] = useState(raw);
  const handleSelectChange = useCallback(value => {
    setSelected(value);

    console.log('Switching to: ' + value);

    if (window.subscriptionIntro) window.subscriptionIntro.unsubscribe();

    if (window.subscriptionRaw) window.subscriptionRaw.unsubscribe();


    subscriptionSetup(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for popup flag when recording
  const [recordPop, setRecordPop] = useState(false);
  const recordPopChange = useCallback(() => setRecordPop(!recordPop), [recordPop]);

  // for popup flag when recording 2nd condition
  const [recordTwoPop, setRecordTwoPop] = useState(false);
  const recordTwoPopChange = useCallback(() => setRecordTwoPop(!recordTwoPop), [recordTwoPop]);

  switch (selected) {
    case intro:
      showAux = false;
      break;
    case raw:
      showAux = true;
      break;
    default:
      console.log('Error on showAux');
  }


  const chartTypes = [
    { label: intro, value: intro },
    { label: raw, value: raw },

  ];

  function buildPipes(value) {
    funIntro.buildPipe(introSettings);

    funRaw.buildPipe(rawSettings);

  }

  function subscriptionSetup(value) {
    switch (value) {
      case intro:
        funIntro.setup(setIntroData, introSettings);
        break;
      case raw:
        funRaw.setup(setRawData, rawSettings);
        break;
      default:
        console.log(
          'Error on handle Subscriptions. Couldn\'t switch to: ' + value,
        );
    }
  }

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
        window.source.eegReadings$ = window.source.eegReadings;
        setStatus(connectionTranslations.connected);
      }
      if (
        window.source.connectionStatus.value === true &&
        window.source.eegReadings$
      ) {
        buildPipes(selected);
        subscriptionSetup(selected);
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
    switch (selected) {
      case intro:
        return null;
      case raw:
        return (
          funRaw.renderSliders(setRawData, setRawSettings, status, rawSettings)
        );

      default:
        console.log('Error rendering settings display');
    }
  }

  function renderModules() {
    switch (selected) {
      case intro:
        return <funIntro.renderModule data={introData} />;
      case raw:
        return <funRaw.renderModule data={rawData} />;
      default:
        console.log('Error on renderCharts switch.');
    }
  }

  function renderRecord() {
    switch (selected) {
      case intro:
        return null;
      case raw:
        return (
          funRaw.renderRecord(recordPopChange, recordPop, status, rawSettings, setRawSettings)
        );
      default:
        console.log('Error on renderRecord.');
    }
  }

  // Render the entire page using above functions
  return (
    <React.Fragment>
      <Card sectioned>
        <Stack>
          <ButtonGroup>
            <Button
              primary={status === connectionTranslations.connect}
              disabled={status !== connectionTranslations.connect}
              onClick={() => {
                window.debugWithMock = false;
                connect();
              }}
            >
              {status}
            </Button>
            <Button
              disabled={status !== connectionTranslations.connect}
              onClick={() => {
                window.debugWithMock = true;
                connect();
              }}
            >
              {status === connectionTranslations.connect ? connectionTranslations.connectMock : status}
            </Button>
            <Button
              destructive
              onClick={refreshPage}
              primary={status !== connectionTranslations.connect}
              disabled={status === connectionTranslations.connect}
            >
              {connectionTranslations.disconnect}
            </Button>
          </ButtonGroup>
          <Checkbox
            label='Enable Muse Auxillary Channel'
            checked={checked}
            onChange={handleChange}
            disabled={!showAux || status !== connectionTranslations.connect}
          />
        </Stack>
      </Card>
      <Card title={translations.title} sectioned>
        <Select
          label={''}
          options={chartTypes}
          onChange={handleSelectChange}
          value={selected}
        />
      </Card>
      {pipeSettingsDisplay()}
      {renderModules()}
      {renderRecord()}
    </React.Fragment>
  );
}
