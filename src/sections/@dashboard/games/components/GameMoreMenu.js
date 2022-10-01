import {useEffect, useRef, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import {Menu, MenuItem, IconButton, ListItemIcon, ListItemText} from '@mui/material';
// component
import Iconify from '../../../../components/Iconify';
import {deleteGameById, getGameInfoById} from "../../../../Database";
import DeleteDialog from "./dialogs/DeleteGameDialog";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "../../../../theme/overrides/Button";
import {EditGameDialog} from "./dialogs/EditGameDialog";

// ----------------------------------------------------------------------

export const x = () => {

}

export const GameMoreMenu = (props) =>{
    const {game} = props;
    const navigate = useNavigate();

    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteClick, setDeleteClick] = useState(false);
    const [editClick, setEditClick] = useState(false);
    const [alertDeleteOpen, setAlertDeleteOpen] = useState(false);
    const [alertEditOpen, setAlertEditOpen] = useState(false);


    useEffect(() => {
        console.log('props', props)
        console.log('game', game)

    }, []);


    function handleAlertDeleteClose() {
        setIsOpen(false)
        setAlertDeleteOpen(false)
    }

    function handleDelete() {
        console.log('in dellll', game.id)
        setDeleteClick(true)
        console.log('game', game)
        deleteGameById(game.id)
        handleAlertDeleteClose()
    }

    function handleEdit() {
        console.log('in edit', game.id)
        setEditClick(true)
    }

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20}/>
            </IconButton>

            <DeleteDialog onClose={()=>{setAlertDeleteOpen(false)}}  open={alertDeleteOpen} onClickCancel={handleAlertDeleteClose} onClickDelete={handleDelete}
                          game={game}/>
            <EditGameDialog open={alertEditOpen} game={game} onClose={()=>{setAlertEditOpen(false)}} onClickEdit={handleEdit}/>


            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: {width: 200, maxWidth: '100%'},
                }}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem sx={{color: 'text.secondary'}} onClick={(event) => {
                    setAlertDeleteOpen(true)
                }}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" width={24} height={24}/>
                    </ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{variant: 'body2'}}/>
                </MenuItem>

                <MenuItem sx={{color: 'text.secondary'}} onClick={(event) => {
                    setAlertEditOpen(true)
                }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24}/>
                    </ListItemIcon>
                    <ListItemText primary="Edit" primaryTypographyProps={{variant: 'body2'}}/>
                </MenuItem>
            </Menu>
        </>
    );
}
