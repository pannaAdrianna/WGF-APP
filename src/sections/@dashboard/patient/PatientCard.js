import React, { useEffect, useState } from 'react';

import { Box, Card, Stack, Typography } from '@mui/material';
import { useAuth } from '../../auth/contexts/AuthContext';
import PropTypes from 'prop-types';
import PatientTestTable from './PatientTestTable';


const PatientCard = (props) => {
  const { user } = useAuth();
  const { patient } = props;


  useEffect(() => {
    console.log('Patient card');
    console.log('Patient Card:', props);
  }, []);


  return (

    <Card>
      <Stack direction='row'>
        <Typography component='span' variant='h4'>
          Patient Card
        </Typography>
        <Typography component='span' variant='h6'>
          Name: {patient.name}
        </Typography>
        <Typography component='span' variant='h6'>
          Surame: {patient.surname}
        </Typography>
      </Stack>
      <Card>
        <PatientTestTable pesel={patient.pesel} />
      </Card>


      {/*<p>Birthday: {format((selectedPatient.birthdate.toDate()), datePattern)}  </p>*/}
      {/*<p>Age: {year - selectedPatient.birthdate.getDate().getFullYear()}</p>*/}


    </Card>


  );

};
export default PatientCard;

