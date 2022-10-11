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
import {fDateTime, formatDate} from "../../../../utils/formatTime";
import {game_size, game_types} from "../enums/gameTypes";


const ariaLabel = {'aria-label': 'description'};
const GameCard = (props) => {
    const {user} = useAuth();
    const {game} = props;
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState('error');
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);
    let name = (game.name).replace(' ', '%20')
    const [bggUrl, setBggUrl] = useState('https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q='+name);


    useEffect(() => {
        console.log('Game card');
        console.log('Game Card:', props);
    }, [bggUrl]);


    function openInNewTab() {
        window.open(bggUrl, '_blank',);
    };

    return (

        <Card sx={{padding: 2, gap: 10}}>

            <Stack direction='column' sx={{padding: 1}}>
                <Typography component='span' variant='h4'>
                    {game.name}
                </Typography>
                <div>
                    <Button size='small' color="primary" type='submit' variant='contained' onClick={openInNewTab}>SEARCH ON BGG</Button>
                </div>
                <Typography component='span' variant='h6'>
                    Rodzaj: {game.gameType} lista rozwijana
                </Typography>
                <Typography component='span' variant='h6'>
                    Pudełko: {game.size} lista rozwijana
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
                    Last Update: <span> {fDateTime(game.lastUpdate.toDate())}</span> <span
                    style={{fontWeight: 'normal'}}>by</span> {game.lastEditBy}
                </Typography>
            </Stack>
            <Stack direction='vertical' sx={{padding: 1}}>
                <Button size='small' color="primary" type='submit' variant='contained'>Save</Button>
            </Stack>

        </Card>


    );

};
export default GameCard;

