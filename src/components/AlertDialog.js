import {useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "../theme/overrides/Button";
import PropTypes from "prop-types";
import GameDialog from "../sections/@dashboard/games/components/dialogs/GameDialog";
import {deleteGameById} from "../Database";

export const AlertDialog = (props) => {

    const {game_id, open} = props

    const [deleteClick, setDeleteClick] = useState(false);
    const [alertOpen, setAlertDeleteOpen] = useState(open);


    function handleAlertDeleteClose() {
        // setDeleteClick(false)
        setAlertDeleteOpen(false)
    }

    function handleDelete() {
        console.log('in dellll', game_id)
        setDeleteClick(true)
        deleteGameById(game_id)

        handleAlertDeleteClose()
    }

    return (

        <Dialog
            open={alertOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Do you want to delete?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You cannot reverse that action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {/*<Button onClick={handleClose}>Disagree</Button>*/}
                <Button onClick={handleDelete} variant='error' autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

    )

}


