import React, { useEffect, useState } from 'react';

import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useAuth } from '../../auth/contexts/AuthContext';
import PropTypes from 'prop-types';
import PatientTestTable from './PatientTestTable';
import { useNavigate } from 'react-router-dom';


const PatientCard = (props) => {
  const { user } = useAuth();
  const { patient } = props;
  const navigate = useNavigate();


  useEffect(() => {
    console.log('Patient card');
    console.log('Patient Card:', props);
  }, []);


  return (

    <Card sx={{ padding: 2, gap: 10 }}>
      <Stack direction='column' sx={{ padding: 1 }}>
        <Typography component='span' variant='h4'>
          Patient Card
        </Typography>
        <Typography component='span' variant='h6'>
          Name: {patient.name}
        </Typography>
        <Typography component='span' variant='h6'>
          Surame: {patient.surname}
        </Typography>
        <Typography component='span' variant='h6'>
          Id: {patient.id}
        </Typography>
      </Stack>
      <Card sx={{ padding: 2 }}>
        <Stack direction='column'>

          <Typography component='span' variant='h5'>
            Tests
          </Typography>
          <Button
            variant='contained'
            size='small'
            onClick={() => {
              navigate('/dashboard/test/add-test', { state: { pesel: patient.pesel , id:patient.id} });
            }}>Add New Test</Button>
          <PatientTestTable pesel={patient.pesel} id={patient.id} />
        </Stack>
      </Card>


      {/*<p>Birthday: {format((selectedPatient.birthdate.toDate()), datePattern)}  </p>*/}
      {/*<p>Age: {year - selectedPatient.birthdate.getDate().getFullYear()}</p>*/}


    </Card>


  );

};
export default PatientCard;

