import GameCard from '../GameCard';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContent, IconButton, Button, Card, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';

const GameDialog = (props) => {
    const {onClose, open, game} = props;
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Game Dialog props');
        console.log(props);
    }, []);


    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <IconButton style={{color: 'grey', background: 'white'}} onClick={onClose}>
                <CloseIcon/>
            </IconButton>
            {loading ?
                <DialogContent style={{padding: 10, alignItems: 'center', gap: 10}}>

                    <DialogTitle>Game Info {game.id}</DialogTitle>
                    <GameCard game={game}/>
                </DialogContent>
                : null}
        </Dialog>
    );
};

GameDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    game: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }),
};
export default GameDialog;