import PlayerCard from './PlayerCard';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContent, IconButton, Button, Card, DialogTitle, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';
import {db} from '../../../Firebase';
import {doc, getDoc} from 'firebase/firestore';

const PlayerInfoDialog = (props) => {
    const {onClose, open, player} = props;
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    }, [player]);


    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <IconButton style={{color: 'grey', background: 'white'}} onClick={onClose}>
                <CloseIcon/>
            </IconButton>

            {loading ?
                <DialogContent style={{padding: 10, alignItems: 'center', gap: 10}}>
                    <DialogTitle>Player Info {player.pesel}</DialogTitle>
                    <PlayerCard player={player}/>
                </DialogContent>
                : null}
        </Dialog>
    );
};

PlayerInfoDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    player: PropTypes.shape({
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
        pesel: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }),
};
export default PlayerInfoDialog;
