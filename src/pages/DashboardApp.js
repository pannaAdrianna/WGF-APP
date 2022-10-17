// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Card, Container, Typography, CardContent} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections

import {useAuth} from '../sections/auth/contexts/AuthContext'
import {namesFromMail} from "../utils/strings";
import AppCardButton from "../sections/@dashboard/app/AppCardButton";
import {GiMeeple} from "react-icons/gi";
import {AppWidgetSummary} from "../sections/@dashboard/app";


// ----------------------------------------------------------------------

// protected
export const DashboardApp = () => {

    const theme = useTheme();

    const {user} = useAuth()

    const stats = () => {

        return (
            <Card title='Statystyki'>
                <CardContent>
                    <Typography variant='h6'>Inne</Typography>
                </CardContent>
            </Card>
        )
    }


    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Cześć {namesFromMail(user.email).split(' ')[0]}
                </Typography>
                <Typography variant="paragraph">
                    Rola
                </Typography>
                // TODO: DOdać statsy
                {stats}

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Games rented now" total={714000} icon={<GiMeeple/>}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="New Users" total={1352831} color="info"
                                          icon={'ic:people-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Item Orders" total={1723315} color="warning"
                                          icon={'ic:people-filled'}/>
                    </Grid>
                </Grid>


            </Container>
        </Page>
    );
}
