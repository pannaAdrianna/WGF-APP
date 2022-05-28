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


export default function Visualize() {

  const navigate = useNavigate();


  return (
    <Page title='Dashboard: Visualize'>
      <Container>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
          <Typography variant='h4' gutterBottom>
            Upload File
          </Typography>
        </Stack>
        <Grid container spacing={2}>

          <p>File upload add </p>
          {/* TODO: Dodać zasilanie z pliku, stan  załadowania pliku do storage */}
          {/*  TODO: Gdy plik załadowany pojawi się przycisk Show chart, dane się przetworzą */}

        </Grid>


      </Container>
    </Page>
  )
    ;

}
