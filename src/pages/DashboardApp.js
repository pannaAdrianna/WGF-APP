
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections

import { useAuth } from '../sections/auth/contexts/AuthContext'


// ----------------------------------------------------------------------

// protected
export const DashboardApp=()=> {

  const theme = useTheme();

  const {user} = useAuth()



  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {user.email}
        </Typography>
          <Typography variant="paragraph">
              Rola
          </Typography>


      </Container>
    </Page>
  );
}
