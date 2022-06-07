import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { Box, Card, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import { useAuth } from '../../sections/auth/contexts/AuthContext';
import PropTypes from 'prop-types';
import PatientDialog from './PatientDialog';


const PatientCard = (props) => {
  const { user } = useAuth();
  const { patient } = props;





  useEffect(() => {
    console.log('Patient card');
    console.log('Patient Card:', props);
  }, []);


  let datePattern = 'dd.MM.yyyy';

  return (

    <Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}
           component='div' alignItems='left'>
        <Typography component='span' variant='h4'>
          Patient Card
        </Typography>

        {/*<Typography component='span' variant='h6'>*/}
        {/*  Name: {currentPatient.name}*/}
        {/*</Typography>*/}
        {/*<Typography component='span' variant='h6'>*/}
        {/*  Surame: {currentPatient.surname}*/}
        {/*</Typography>*/}

        {/*<Typography component='span' variant='h6'>*/}
        {/*  PESEL: {currentPatient.pesel}*/}
        {/*</Typography>*/}


        {/*   <Typography component="span" variant="h6">
                    Email: {currentUser.email}
                    Date of birth:{format((currentPatient.birthdate),datePattern)}
                    Date of birth:{currentPatient.birthdate}
                </Typography>*/}
        {/*<p>Birthday: {format((selectedPatient.birthdate.toDate()), datePattern)}  </p>*/}
        {/*<p>Age: {year - selectedPatient.birthdate.getDate().getFullYear()}</p>*/}

      </Box>


    </Card>


  );

};
PatientCard.propTypes = {
  pesel: PropTypes.string.isRequired,
};
export default PatientCard;

