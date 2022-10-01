import React, {useEffect, useRef, useState} from 'react';


import {v4 as uuidv4} from 'uuid';


import {useAuth} from '../../../auth/contexts/AuthContext';
import {Button, Container, Grid, TextField} from '@material-ui/core';
import {Alert, IconButton, Stack, Typography} from '@mui/material';
import {db} from '../../../../Firebase';
import {serverTimestamp, setDoc, addDoc, collection, doc, Timestamp, getFirestore} from 'firebase/firestore';
import {FormContainer, PasswordElement, TextFieldElement} from 'react-hook-form-mui';
import CloseIcon from '@mui/icons-material/Close';
import {useForm} from 'react-hook-form';
import Page from '../../../../components/Page';
import {useNavigate} from 'react-router-dom';
import {capitalizeFirstLetter, namesFromMail} from "../../../../utils/strings";
import {addNewGame} from "../../../../Database";
import {timeout} from "../../../../utils/timeouts";

const GameForm = () => {

        const {user} = useAuth();
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


            // eslint-disable-next-line
        }, []);





        const onSubmit = async (data) => {
            setLoading(true);
            console.log('on submit ', data);

            const owner = user ? user.uid : 'unknown';
            const ownerEmail = user ? user.email : 'unknown';


            let id = uuidv4();


            const newGame = {
                name: capitalizeFirstLetter(data.name),
                status: 'available',
                id: id,
                addedBy: ownerEmail.replace("@wgf.pl", ""),
                lastEditBy: namesFromMail(ownerEmail),
                createdAt: serverTimestamp(),
                lastUpdate: serverTimestamp(),
                games: doc(db, 'games', (id)),

            };
            addNewGame(newGame);

            setErrorType('success');
            setError(`Game ${newGame.name} added`);
            setLoading(false);

            await timeout(1500);
            navigate('/dashboard/games')

        };


        return (
            <Page title="New Game">
                <Container maxWidth="md">
                    <Typography variant='h4' gutterBottom>
                        Add New Game
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
                            <TextFieldElement id='name' name='name' label='Name' required/>
                            <p>Typ dokumentu: dowód, paszport, karta pobytu</p>
                            <p>Adres zamieszkania</p>
                            <p>Inne</p>
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

export default GameForm;
