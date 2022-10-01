import {Dialog, DialogContent, IconButton, Button, Card, DialogTitle} from '@mui/material';
import * as PropTypes from "prop-types";
import {getGameInfoById} from "../../../../../Database";
import {useEffect, useState} from "react";
import {DialogActions, DialogContentText} from "@material-ui/core";


export default function DeleteDialog(props) {

    const {open, close, game}=props;




    useEffect(() => {
        console.log('props',props)
    }, []);


    return <Dialog
        open={open} onClose={close} fullWidth
    >
        <DialogTitle>{"Do you really want to delete "} <b>{game.name}</b>{"?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                You cannot reverse that action.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClickCancel}>CANCEL</Button>
            <Button onClick={props.onClickDelete} variant="contained" color="secondary">
                DELETE
            </Button>
        </DialogActions>
    </Dialog>;
}

DeleteDialog.propTypes = {
    open: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickDelete: PropTypes.func,
    game_id: PropTypes.string,

};
