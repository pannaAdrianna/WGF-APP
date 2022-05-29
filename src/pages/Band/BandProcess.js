import { Link as RouterLink } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { MuseClient } from 'muse-js';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';


import Page from '../../components/Page';
import Card from '../../theme/overrides/Card';


const steps = [
  {
    label: 'Connect Headband',
    description: `Turn on bluetooth on headband and your device.\n
    Click on connect button to check the connection.
    `,
  },
  {
    label: 'Set up band (załóż)',
    description:
      'TT',
  },
  {
    label: 'Set up timer',
    description: `Czas badania licznik`,
  },
];


export default function Band() {
  const [activeStep, setActiveStep] = React.useState(0);


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const startConnection = () => {
    console.log('Connection start')

  }

  return (
    <Page title='Muse Connection'>
      <Container>
        {/*<Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>*/}
        <Typography variant='h4' gutterBottom>
          Process odczytu z opaski
        </Typography>
        {/*<Box sx={{ maxWidth: 400 }}>*/}
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
                {activeStep === 0 && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>Pierwsze</Typography>
                  </Paper>
                )}

                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant='contained'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
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
            <Typography>All steps completed - You can start</Typography>
            <Button variant='contained'  onClick={startConnection}>Start registration</Button>
          </Paper>
        )}
        {/*</Box>*/}


        {/*</Stack>*/}


      </Container>
    </Page>
  );

}
