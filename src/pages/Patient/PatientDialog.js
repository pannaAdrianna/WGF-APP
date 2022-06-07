
import PatientCard from "./PatientCard";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Dialog, DialogContent, IconButton, Button, Card} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';

const PatientDialog = (props) => {
    const {onClose, open, selectedPatient} = props;
    const navigate = useNavigate();

    useEffect(() => {
        console.log('PAtientDialog', selectedPatient[0])
        console.log('PAtientDialog.name', selectedPatient.name)
        // let pat = new Patient(select)


        // eslint-disable-next-line
    }, []);



    const handleClose = () => {
        onClose();
    };


    let year = new Date().getFullYear()
    let datePattern = "dd.MM.yyyy"
    return (
        <Dialog onClose={handleClose} open={open}>
            <IconButton style={{color: 'grey', background: 'white'}} onClick={handleClose}>
                <CloseIcon/>
            </IconButton>
            <DialogContent style={{padding: 10, alignItems: 'center', gap: 10}}>
                {/*<DialogTitle>Patient Info</DialogTitle>*/}

                <PatientCard myPatient={selectedPatient}/>
                <Button
                        onClick={() => navigate('/eeg-test', {patient: selectedPatient})}>Add New
                    Test</Button>

                <Card>
                    <h1>Patient's Tests</h1>
                    {/*<PatientTestTable pesel={selectedPatient.pesel}/>*/}
                </Card>
                < >
                    {/*<Button className={classes.button} style={{background: 'darkgreen'}}>Save</Button>*/}
                    <Button
                            onClick={handleClose}>Close</Button>
                </>
            </DialogContent>
        </Dialog>
    );
}

PatientDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedPatient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
        pesel: PropTypes.string.isRequired
    })
};
export default PatientDialog;
