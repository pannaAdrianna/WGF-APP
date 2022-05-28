import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { replace } from 'formik';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Page from '../components/Page';


import Iconify from '../components/Iconify';

import { fShortenNumber } from '../utils/formatNumber';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import AppCardButton from '../sections/@dashboard/app/AppCardButton';


export default function EEGTest() {

  const navigate = useNavigate();


  return (
    <Page title='Dashboard: EEG'>
      <Container>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
          <Typography variant='h4' gutterBottom>
            Add EEG data
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={3} sm={6} md={3}>
            <AppCardButton title='Upload file' color='info' onClick={() => {
              navigate('/dashboard/fileUpload');
            }} icon={'ant-design:file-add-filled'} />
          </Grid>

          <Grid item xs={3} sm={6} md={3}>
            <AppCardButton title='Muse Handband' onClick={() => {
              navigate('/dashboard/band');
            }} color='info'
                           icon={'ant-design:play-square-outlined'} />
          </Grid>

        </Grid>


      </Container>
    </Page>
  )
    ;

}
