import React from 'react';
import { catchError, multicast } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

import { TextContainer, Card, Stack, RangeSlider, Button, ButtonGroup, Modal, Link } from '@shopify/polaris';
import { saveAs } from 'file-saver';
import { take, takeUntil } from 'rxjs/operators';

import { channelNames } from 'muse-js';
import { Line, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';


import { zipSamples } from 'muse-js';


import {
  bandpassFilter,
  epoch,
} from '@neurosity/pipes';

import { chartStyles, generalOptions } from '../chartOptions';


import { default as connectionTranslations } from '../connectionStatesTranslations/en.json';
import { default as chartTranslations } from './translations/en.json';

import { generateXTics } from '../../utils/chartUtils';

ChartJS.register(...registerables);

export function getSettings() {
  return {
    cutOffLow: .1,
    cutOffHigh: 35,
    interval: 25,
    srate: 256,
    duration: 1024,
    name: 'Raw',
    secondsToSave: 10,
    beginAtZero: true
  };
};

export function buildPipe(Settings) {
  if (window.subscriptionRaw) window.subscriptionRaw.unsubscribe();

  window.pipeRaw$ = null;
  window.multicastRaw$ = null;
  window.subscriptionRaw = null;

  // Build Pipe
  window.pipeRaw$ = zipSamples(window.source.eegReadings$).pipe(
    bandpassFilter({
      cutoffFrequencies: [Settings.cutOffLow, Settings.cutOffHigh],
      nbChannels: window.nchans,
    }),
    epoch({
      duration: Settings.duration,
      interval: Settings.interval,
      samplingRate: Settings.srate,
    }),
    catchError(err => {
      console.log(err);
    }),
  );
  window.multicastRaw$ = window.pipeRaw$.pipe(
    multicast(() => new Subject()),
  );
}

export function setup(setData, Settings) {
  console.log('Subscribing to ' + Settings.name);

  if (window.multicastRaw$) {
    window.subscriptionRaw = window.multicastRaw$.subscribe(data => {
      setData(rawData => {
        Object.values(rawData).forEach((channel, index) => {
          channel.datasets[0].data = data.data[index];
          channel.xLabels = generateXTics(Settings.srate, Settings.duration);
          // channel.datasets[0].qual = standardDeviation(data.data[index])
        });

        return {
          ch0: rawData.ch0,
          ch1: rawData.ch1,
          ch2: rawData.ch2,
          ch3: rawData.ch3,
          ch4: rawData.ch4,
        };
      });
    });

    window.multicastRaw$.connect();
    console.log('Subscribed to Raw');
  }
}

export function renderModule(channels) {
  function renderCharts() {
    const options = {
      ...generalOptions,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.xAxes[0].scaleLabel,
              labelString: chartTranslations.xlabel,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.yAxes[0].scaleLabel,
              labelString: chartTranslations.ylabel,
            },
          },
        ],
      },
      animation: {
        duration: 0,
      },
      title: {
        ...generalOptions.title,
        text: 'Raw data from EEG electrdoes',
      },
      legend: {
        display: true,
      },
    };

    if (channels.data.ch3.datasets[0].data) {
      const newData = {
        datasets: [{
          label: channelNames[0],
          borderColor: 'rgba(217,95,2)',
          data: channels.data.ch0.datasets[0].data.map(function(x) {
            return x + 300;
          }),
          fill: false,
        }, {
          label: channelNames[1],
          borderColor: 'rgba(27,158,119)',
          data: channels.data.ch1.datasets[0].data.map(function(x) {
            return x + 200;
          }),
          fill: false,
        }, {
          label: channelNames[2],
          borderColor: 'rgba(117,112,179)',
          data: channels.data.ch2.datasets[0].data.map(function(x) {
            return x + 100;
          }),
          fill: false,
        }, {
          label: channelNames[3],
          borderColor: 'rgba(231,41,138)',
          data: channels.data.ch3.datasets[0].data.map(function(x) {
            return x + 0;
          }),
          fill: false,
        }, {
          label: channelNames[4],
          borderColor: 'rgba(20,20,20)',
          data: channels.data.ch4.datasets[0].data.map(function(x) {
            return x + -100;
          }),
          fill: false,
        }],
        xLabels: channels.data.ch0.xLabels,
      };

      return (
        <Card.Section key={'Card_' + 1}>
          <Line key={'Line_' + 1} data={newData} options={options} />
        </Card.Section>
      );
    } else {
      return (
        <Card.Section>
          <TextContainer>
            <p> {[
              'Press connect above to see the chart.',
            ]}
            </p>
          </TextContainer>
        </Card.Section>
      );
    }
  }


  return (
    <Card title={chartTranslations.title}>
      <Card.Section>
        <div style={chartStyles.wrapperStyle.style}>{renderCharts()}</div>
      </Card.Section>
      <Card.Section>
        <TextContainer>
          <p> {[
            'If you have not already, it is now time to place the muse on your head. ',
            'Getting a good connection between the device and your head is crucial. ',
            'The following video gives tips on how to get a great connection: ',
          ]} </p>
          <p> {[
            'The above chart shows the data coming from each of the four eeg electrodes. ',
            'Time, again, is on the horizontal X-axis and voltage is on the Y-axis. ',
            'An offset has been added to the electrodes to separate them vertically. ',
            'The saturation of the lines is controlled by the amount of noise in the data. ',
            'That is, the cleaner the data, the more rich the colours will become. ',
            'Conversely, when the line gets dim, there is too much noise present in the signal. ',
            'I have set the filter settings above very loose (.1 to 100 Hz) to let in as much noise as possible so we can learn, we will restrict them in future modules. ',
          ]} </p>
        </TextContainer>
      </Card.Section>
      <Card.Section title='Artifacts'>
        <TextContainer>
          <p> {[
            'Before we try to use the EEG to estimate brain activity, we first need to observe what other things can influence the signal. ',
            'Artifacts refer to non-EEG noise in the EEG recording that will cloud the results we want from the brain. ',
            'There are many sources of noise that the EEG can pickup because all it is doing is recording the voltage changes on the head. ',
            'Any other source of voltage or change in resistance of the sensor can affect the signal. ',
            'Here is a great overview of the range of possible EEG artifacts that you might come accross. ',
          ]} </p>
        </TextContainer>
        <br />
      </Card.Section>

    </Card>
  );
}

export function renderSliders(setData, setSettings, status, Settings) {

  function resetPipeSetup(value) {
    buildPipe(Settings);
    setup(setData, Settings);
  }

  function handleIntervalRangeSliderChange(value) {
    setSettings(prevState => ({ ...prevState, interval: value }));
    resetPipeSetup();
  }

  function handleCutoffLowRangeSliderChange(value) {
    setSettings(prevState => ({ ...prevState, cutOffLow: value }));
    resetPipeSetup();
  }

  function handleCutoffHighRangeSliderChange(value) {
    setSettings(prevState => ({ ...prevState, cutOffHigh: value }));
    resetPipeSetup();
  }

  function handleDurationRangeSliderChange(value) {
    setSettings(prevState => ({ ...prevState, duration: value }));
    resetPipeSetup();
  }

  return (
    <Card title={Settings.name + ' Settings'} sectioned>
      <RangeSlider
        disabled={status === connectionTranslations.connect}
        min={1} step={1} max={4096}
        label={'Epoch duration (Sampling Points): ' + Settings.duration}
        value={Settings.duration}
        onChange={handleDurationRangeSliderChange}
      />
      <RangeSlider
        disabled={status === connectionTranslations.connect}
        min={1} step={1} max={Settings.duration}
        label={'Sampling points between epochs onsets: ' + Settings.interval}
        value={Settings.interval}
        onChange={handleIntervalRangeSliderChange}
      />
      <RangeSlider
        disabled={status === connectionTranslations.connect}
        min={.01} step={.5} max={Settings.cutOffHigh - .5}
        label={'Cutoff Frequency Low: ' + Settings.cutOffLow + ' Hz'}
        value={Settings.cutOffLow}
        onChange={handleCutoffLowRangeSliderChange}
      />
      <RangeSlider
        disabled={status === connectionTranslations.connect}
        min={Settings.cutOffLow + .5} step={.5} max={Settings.srate / 2}
        label={'Cutoff Frequency High: ' + Settings.cutOffHigh + ' Hz'}
        value={Settings.cutOffHigh}
        onChange={handleCutoffHighRangeSliderChange}
      />
    </Card>
  );
}

export function renderRecord(recordPopChange, recordPop, status, Settings, setSettings) {

  function handleSecondsToSaveRangeSliderChange(value) {
    setSettings(prevState => ({ ...prevState, secondsToSave: value }));
  }

  return (
    <Card title={'Record ' + Settings.name + ' Data'} sectioned>
      <Stack>
        <RangeSlider
          disabled={status === connectionTranslations.connect}
          min={2}
          max={180}
          label={'Recording Length: ' + Settings.secondsToSave + ' Seconds'}
          value={Settings.secondsToSave}
          onChange={handleSecondsToSaveRangeSliderChange}
        />
        <ButtonGroup>
          <Button
            onClick={() => {
              saveToCSV(Settings);
              recordPopChange();
            }}
            primary={status !== connectionTranslations.connect}
            disabled={status === connectionTranslations.connect}
          >
            {'Save to CSV'}
          </Button>
        </ButtonGroup>
        <Modal
          open={recordPop}
          onClose={recordPopChange}
          title='Recording Data'
        >
          <Modal.Section>
            <TextContainer>

              <p>
                Your data is currently recording,
                once complete it will be downloaded as a .csv file
                and can be opened with your favorite spreadsheet program.
                Close this window once the download completes.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Stack>
    </Card>
  );
}


function saveToCSV(Settings) {
  console.log('Saving ' + Settings.secondsToSave + ' seconds...');
  var localObservable$ = null;
  const dataToSave = [];

  console.log('making ' + Settings.name + ' headers');


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

  // Create timer
  const timer$ = timer(Settings.secondsToSave * 1000);

  // put selected observable object into local and start taking samples
  localObservable$ = window.multicastRaw$.pipe(
    takeUntil(timer$),
  );

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
      saveAs(blob, Settings.name + '_Recording_' + Date.now() + '.csv');
      console.log('Completed');
    },
  });
}
