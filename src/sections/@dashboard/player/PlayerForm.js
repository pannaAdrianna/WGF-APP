import React, {useEffect, useRef, useState} from 'react';


import {v4 as uuidv4} from 'uuid';


import {useAuth} from '../../auth/contexts/AuthContext';
import {Button, Container, Grid, TextField} from '@material-ui/core';
import {Alert, IconButton, Stack, Typography} from '@mui/material';
import {db} from '../../../Firebase';
import {serverTimestamp, setDoc, addDoc, collection, doc, Timestamp, getFirestore} from 'firebase/firestore';
import {FormContainer, PasswordElement, TextFieldElement} from 'react-hook-form-mui';
import CloseIcon from '@mui/icons-material/Close';
import {useForm} from 'react-hook-form';
import Page from '../../../components/Page';
import {useNavigate} from 'react-router-dom';
import {namesFromMail} from "../../../utils/strings";

const PlayerForm = () => {

        const {user} = useAuth();
        const navigate = useNavigate();


        useEffect(() => {
            document.title = `New Player`;
        });


        const [birthDay, setBirthDay] = useState(new Date());


        const [loading, setLoading] = useState(false);
        const [open, setOpen] = useState(true);
        const [error, setError] = useState('');
        const [errorType, setErrorType] = useState('error');
        const {register, handleSubmit, watch, formState: {errors}} = useForm();

        useEffect(() => {


            // eslint-disable-next-line
        }, []);

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


        const onSubmit = async (data) => {
            setLoading(true);
            console.log('on submit ', data);

            const owner = user ? user.uid : 'unknown';
            const ownerEmail = user ? user.email : 'unknown';


            let id = uuidv4();

            const newPlayer = {
                name: capitalizeFirstLetter(data.name),
                surname: capitalizeFirstLetter(data.surname),
                pesel: data.pesel,
                id: id,
                wgf_temp_id: 'brak',
                owner,
                ownerEmail,
                birthDay,
                createdAt: serverTimestamp(),
                lastUpdate: serverTimestamp(),
                lastEditBy: namesFromMail(ownerEmail),

            };
            writePlayer(newPlayer);
            setLoading(false);

            await timeout(2000);
            navigate('/dashboard/players')

        };

        function timeout(delay) {
            return new Promise(res => setTimeout(res, delay));
        }

        function writePlayer(player) {
            setDoc(doc(db, 'players', (player.id)), player, {merge: true}).then
            ((r) => {
                    setErrorType('success');
                    setError(`Player ${player.pesel} added`);
                    console.log('response', r);
                },
            );
        }

        return (
            <Page title="Add New Player">
                <Container maxWidth="md">
                    <Typography variant='h4' gutterBottom>
                        Add New Player
                    </Typography>

                    <FormContainer
                        onSuccess={onSubmit}
                    >
                        {error && <Alert
                            action={
                                <IconButton
                                    aria-label='close'
                                    color='inherit'
                                    size='small'
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize='inherit'/>
                                </IconButton>
                            }
                            severity={errorType}
                            sx={{mb: 2}}
                        >
                            {error}
                        </Alert>}


                        <Stack spacing={3}>
                            <TextFieldElement id='name' name='name' label='First Name' required/>
                            <TextFieldElement id='surname' name='surname' label='Surname' required/>
                            <p>Typ dokumentu: dowód, paszport, karta pobytu</p>
                            <p>Adres zamieszkania</p>
                            <p>Inne</p>
                            <TextFieldElement id='pesel' name='pesel' label='Pesel' required/>
                        </Stack>
                        <Button size='small' color="default" type='submit' variant='contained' onClick={handleSubmit}>
                            Add
                        </Button>


                    </FormContainer>

                </Container>
            </Page>
        );
    }
;

export default PlayerForm;
