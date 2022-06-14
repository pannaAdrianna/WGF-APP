import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import Page from '../components/Page';
import AppCardButton from '../sections/@dashboard/app/AppCardButton';


export const EEGTest = (props) => {

  const {state} = useLocation();
  const navigate = useNavigate();



  return (
    <Page title='Dashboard: EEG'>
      <Container>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
          <Typography variant='h4' gutterBottom>
            Add EEG data {state.pesel}
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={3} sm={6} md={3}>
            <AppCardButton title='Upload file' color='info' onClick={() => {
              navigate('/dashboard/test/add-file', { state: { pesel: state.pesel, id: state.id} });
            }} icon={'ant-design:file-add-filled'} />
          </Grid>

          <Grid item xs={3} sm={6} md={3}>
            <AppCardButton title='Muse Handband' onClick={() => {
              navigate('/dashboard/test/band', { state: { pesel: state.pesel, id: state.id } });
            }} color='info'
                           icon={'ant-design:play-square-outlined'} />
          </Grid>

        </Grid>


      </Container>
    </Page>
  )
    ;

};
