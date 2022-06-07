


import React, {useEffect, useState} from "react";

import {format} from "date-fns";
import { Box, Card, Typography } from '@mui/material';



const PatientCard = (props) => {




    const [currentPatient, setCurrentPatient] = useState({});




    useEffect(() => {
        console.log('Patient card')
        setCurrentPatient(prevState => {
            // Object.assign would also work
            // return {...prevState, ...new Patient(props.myPatient.name, props.myPatient.surname, props.myPatient.pesel)};
        });
        console.log('Patient Card:', currentPatient)
    }, []);


    let datePattern = "dd.MM.yyyy"

    return (

        <Card >

            <Box sx={{display: 'flex', flexDirection: 'column', gap: 10}}
                 component="div" alignItems="left">
                <Typography component="span" variant="h4">
                    Patient Card
                </Typography>

                {/*<Avatar className={classes.avatar}>*/}
                {/*    {faker.internet.avatar()}*/}
                {/*</Avatar>*/}

                <Typography component="span" variant="h6">
                    Name: {currentPatient.name}
                </Typography>
                <Typography component="span" variant="h6">
                    Surame: {currentPatient.surname}
                </Typography>

                <Typography component="span" variant="h6">
                    PESEL: {currentPatient.pesel}
                </Typography>

                {/*  <Typography component="span" variant="a">
                    Sex: {currentPatient.sex}
                </Typography>*/}

                <Typography component="span" variant="h6">
                    {/*Email: {currentUser.email}*/}
                    Email: currentPatient.email@example.com
                </Typography>
             {/*   <Typography component="span" variant="h6">
                    Email: {currentUser.email}
                    Date of birth:{format((currentPatient.birthdate),datePattern)}
                    Date of birth:{currentPatient.birthdate}
                </Typography>*/}
                {/*<p>Birthday: {format((selectedPatient.birthdate.toDate()), datePattern)}  </p>*/}
                {/*<p>Age: {year - selectedPatient.birthdate.getDate().getFullYear()}</p>*/}

            </Box>


        </Card>


    )

}
export default PatientCard;
