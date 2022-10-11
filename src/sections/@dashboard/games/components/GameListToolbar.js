import PropTypes from 'prop-types';
// material
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment} from '@mui/material';
import Iconify from "../../../../components/Iconify";
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
    gamesNames: PropTypes.array,
};

export default function GameListToolbar({ filterName, onFilterName, gamesNames}) {

    const numSelected = gamesNames.length;
    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div">
                    <Typography component="div" variant="subtitle1">
                        Choosen games:

                    </Typography>
                    {gamesNames.map((game) => {
                        return (
                            <Typography variant='paragraph'>{game}, </Typography>
                        )
                    })}
                </Typography>
            ) : (
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
            )}

            {numSelected > 0 ? (
                <Tooltip title="Rent">
                    <IconButton autoFocus={true}>
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
