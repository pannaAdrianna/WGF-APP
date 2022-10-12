import PropTypes from 'prop-types';
// material
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment} from '@mui/material';
import Iconify from "../../../../components/Iconify";
import {addNewRental} from "../../../../Database";
import {v4 as uuidv4} from "uuid";
import {doc, serverTimestamp} from "firebase/firestore";
import {namesFromMail} from "../../../../utils/strings";
import {db} from "../../../../Firebase";
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

export default function GameListToolbar({filterName, onFilterName, gamesList}) {

    const numSelected = gamesList.length;

    function handleRent(event, gamesList) {
        let playerId="4170d557-dbe3-4787-8f9a-07e4ee98ec1b";
        console.log('games list', gamesList)
        gamesList.map((game, i )=>{
            if (game.status !== 'rented'){


                // const owner = user ? user.uid : 'unknown';
                // const ownerEmail = user ? user.email : 'unknown';
                const ownerEmail = 'admin';


                let id = uuidv4();

                const newRental = {
                    id: id,
                    gameId: game.id,
                    playerId: playerId,
                    rentedAt: serverTimestamp(),
                    returnedAt: null,
                    // lastEditBy: namesFromMail(ownerEmail),
                    lastEditBy: ownerEmail,

                };
                addNewRental(newRental, game)
            }

        })


    }

    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            <>
                <Typography component="div">
                    <Typography component="div" variant="subtitle1">
                        Choosen games:

                    </Typography>
                    {gamesList.map((game, i) => {
                        return (
                            <Typography component='p' key={i} >{game.name}, </Typography>
                        )
                    })}
                </Typography>

                <SearchStyle
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search game by name..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>

                    }
                />
            </>

            {numSelected > 0 ? (
                <Tooltip title="Rent">
                    <IconButton onClick={(event)=>{handleRent(event, gamesList)}}>
                        <Iconify icon="ic:add-circle"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
}
