import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import {styled} from '@mui/material/styles';
import {Button, Typography, Container, Box, Alert, IconButton, Stack} from '@mui/material';
// components
import Page from '../components/Page';

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@material-ui/core";
import {v4 as uuidv4} from "uuid";

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function MyTest() {

    const navigate = useNavigate();


    useEffect(() => {
        document.title = `New Game`;
    });


    const [birthDay, setBirthDay] = useState(new Date());
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const [errorType, setErrorType] = useState('error');
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = `New Game`;
    });


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const onSubmit = async (data) => {

        let id = uuidv4();


    }
    const ariaLabel = {'aria-label': 'description'};

    return (
        <Page title="MyTest" component="form">
            <Container>
                <ContentStyle sx={{textAlign: 'center', alignItems: 'center'}}>
                    <Typography variant="h3" paragraph>
                        MyTest
                    </Typography>

                    <Typography sx={{color: 'text.secondary'}}>
                        Test
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': {m: 1},
                        }}
                        noValidate
                        autoComplete="off"
                    >

                        <Input placeholder="name" inputProps={ariaLabel}/>
                        <Button onClick={onSubmit}>
                            Submit
                        </Button>
                    </Box>


                    <Button to="/" size="large" variant="contained" component={RouterLink}>
                        Go to Home
                    </Button>
                </ContentStyle>
            </Container>
        </Page>
    );
}
