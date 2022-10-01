import {Dialog, DialogContent, IconButton, Card, DialogTitle} from '@mui/material';
import * as PropTypes from "prop-types";

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import GameCard from "../GameCard";


export const EditGameDialog = (props) => {
    const {onClose, open, game} = props;
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Edit Game Dialog props');
        console.log(props);
    }, []);


    return (<Dialog open={open} onClose={onClose} fullWidth>
            <IconButton style={{color: 'text.secondary', background: 'white'}} onClick={onClose}>
                <CloseIcon/>
            </IconButton>

            <DialogContent style={{padding: 10, alignItems: 'center', gap: 10}}>

                <DialogTitle>Game Info {game.name}</DialogTitle>
                <GameCard game={game}/>
            </DialogContent>

        </Dialog>
    )
}

EditGameDialog.propTypes = {
    open: PropTypes.bool,
    onClickEdit: PropTypes.func,


};
