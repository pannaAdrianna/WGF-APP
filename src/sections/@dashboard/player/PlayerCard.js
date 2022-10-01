import React, {useEffect, useState} from 'react';

import {Box, Button, Card, Stack, TableCell, Typography} from '@mui/material';
import {useAuth} from '../../auth/contexts/AuthContext';
import PropTypes from 'prop-types';
import PlayerRentTable from './PlayerRentTable';
import {useNavigate} from 'react-router-dom';
import Label from "../../../components/Label";


const PlayerCard = (props) => {
    const {player} = props;
    const navigate = useNavigate();
    const [rental_status, setRentalStatus] = useState('unknown')


    useEffect(() => {
    }, [player, rental_status]);

    const handleStatus = (data) =>{
        console.log('data', data)
    }


    return (

        <Card sx={{padding: 2, gap: 10}}>
            <Stack direction='column' sx={{padding: 1}}>
                <Typography component='span' variant='h4'>
                    Player Card
                </Typography>
                <Typography component='span' variant='h6'>
                    Name: {player.name}
                </Typography>
                <Typography component='span' variant='h6'>
                    Surame: {player.surname}
                </Typography>
                <Typography component='span' variant='h6'>
                    Id: {player.id}
                </Typography>
                <Typography component='span' variant='h6'>
                     Status:
                    <Label variant="ghost"
                           color={(rental_status === 'clear' && 'success') || (rental_status === 'unknown' && 'info') ||'error'}>
                        {rental_status}
                    </Label>
                </Typography>
            </Stack>
            <Card sx={{padding: 2}}>
                <Stack direction='column'>

                    <Typography component='span' variant='h5'>
                        Rentals
                    </Typography>
                    <PlayerRentTable pesel={player.pesel} id={player.id}/>
                </Stack>
            </Card>

        </Card>


    );

};
export default PlayerCard;

