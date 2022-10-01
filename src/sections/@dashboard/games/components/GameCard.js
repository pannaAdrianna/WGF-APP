import React, {useEffect, useState} from 'react';

import {Alert, Box, Card, IconButton, Stack, Typography} from '@mui/material';
import {useAuth} from '../../../auth/contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {addNewGame, deleteGameById, updateGame, updateGameStatus} from "../../../../Database";
import Label from "../../../../components/Label";
import {Button, Input} from "@material-ui/core";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import CloseIcon from "@mui/icons-material/Close";
import {useForm} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import {capitalizeFirstLetter, namesFromMail} from "../../../../utils/strings";
import {doc, serverTimestamp} from "firebase/firestore";

const ariaLabel = {'aria-label': 'description'};
const GameCard = (props) => {
    const {user} = useAuth();
    const {game} = props;
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState('error');
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log('Game card');
        console.log('Game Card:', props);
    }, []);


    const onSubmit = async (data) => {
        setLoading(true);
        console.log('on submit ', data);

        const ownerEmail = user ? user.email : 'unknown';


        const updatedGameInfo = {
            name: capitalizeFirstLetter(data.name),
            status: 'available',
            lastEditBy: namesFromMail(ownerEmail),
            lastUpdate: serverTimestamp(),

        };
        await updateGame(updatedGameInfo).then(r => {
                setErrorType('success');
                setError(`Game ${updatedGameInfo.name} updated`);
                setLoading(false);
            }
        )


    };


    return (

        <Card sx={{padding: 2, gap: 10}}>


            {/*    <FormContainer
                onSuccess={onSubmit}
            >
                <Stack spacing={3}>
                    <TextFieldElement id='name' name='name' label='Name' required/>
                    <p>Typ dokumentu: dowód, paszport, karta pobytu</p>
                    <p>Adres zamieszkania</p>
                    <p>Inne</p>
                </Stack>
                <Button size='small' color="default" type='submit' variant='contained' onClick={onSubmit}>
                    Add
                </Button>

            </FormContainer>*/}
            <FormContainer
                // onSuccess={onSubmit}
            >
                <Stack spacing={3}>
                    <TextFieldElement id='name' name='name' label='Name' required/>
                    <p>Typ dokumentu: dowód, paszport, karta pobytu</p>
                    <p>Adres zamieszkania</p>
                    <p>Inne</p>
                </Stack>
                <Button size='small' color="default" type='submit' variant='contained' onClick={onSubmit}>
                    Add
                </Button>


            </FormContainer>

            <Stack direction='column' sx={{padding: 1}}>
                <Typography component='span' variant='h4'>
                    {game.name}
                </Typography>

                <Typography component='span' variant='h6'>
                    Name: <Input placeholder={game.name} inputProps={ariaLabel}/>
                </Typography>
                <Typography component='span' variant='h6'>
                    Status:
                    <Label variant="ghost"
                           color={(game.status === 'rented' && 'error') || 'success'}>
                        {game.status}
                    </Label>
                </Typography>
                {game.status === 'rented' ? <Typography span='span' variant='h6'>
                    Rented by:
                </Typography> : null}
                <Typography component='span' variant='h6'>
                    Last Edit By: {game.last_edited_by}
                </Typography>
            </Stack>
            <Stack direction='vertical' sx={{padding: 1}}>
                <Button>Save</Button>
            </Stack>

        </Card>


    );

};
export default GameCard;

