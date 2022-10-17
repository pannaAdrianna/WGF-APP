import PropTypes from 'prop-types';
// material
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Alert, Button} from '@mui/material';
import Iconify from "../../../../components/Iconify";
import {addNewRental} from "../../../../Firebase/Database";
import {v4 as uuidv4} from "uuid";
import {doc, serverTimestamp} from "firebase/firestore";
import {namesFromMail} from "../../../../utils/strings";
import {db} from "../../../../Firebase";
import {useAuth} from "../../../auth/contexts/AuthContext";
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {Snackbar} from "@material-ui/core";
// component
// ----------------------------------------------------------------------


const RootStyle = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
    },
}));

// ----------------------------------------------------------------------

GameListToolbar.propTypes = {

    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    gamesList: PropTypes.arrayOf(PropTypes.object),
};

export default function GameListToolbar({filterName, onFilterName, gamesList, message}) {

    // const ownerEmail = user ? user.email : 'unknown';


    const numSelected = gamesList.length;


    return (
        <RootStyle
            sx={{
                ...(numSelected >= 1 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            <>

                <SearchStyle
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search game by name..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill"
                                     sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>

                    }
                />
                {numSelected > 0 ? (
                    <Typography component="div">
                        <Typography component="div" variant="subtitle1">
                            Chosen games:
                        </Typography>
                        {gamesList.map((game, i) => {
                            return (
                                <Typography component='p' key={i}>{game.name}, </Typography>
                            )
                        })}
                    </Typography>) : null}
            </>

            {/*{numSelected > 0 ? (
                <Tooltip title="Rent">
                    <IconButton onClick={(event) => {
                        handleRent(event, gamesList)
                    }}>
                        <Iconify icon="ic:add-circle"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}*/}
        </RootStyle>
    );
}
