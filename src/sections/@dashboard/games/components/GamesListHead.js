import PropTypes from 'prop-types';
// material
import {
    Box,
    Checkbox,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    InputAdornment,
    OutlinedInput
} from '@mui/material';
import Iconify from "../../../../components/Iconify";
import {styled} from "@mui/material/styles";

// ----------------------------------------------------------------------

const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)',
};

GamesListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    headLabel: PropTypes.array,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func,
    isRent: PropTypes.bool,
};

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

export default function GamesListHead({
                                          order,
                                          orderBy,
                                          rowCount,
                                          headLabel,
                                          numSelected,
                                          onRequestSort,
                                          onSelectAllClick,
                                          isRent
                                      }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {!isRent ? null : (
                    <TableCell padding="checkbox">Checkbox

                    </TableCell>)}
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.alignRight ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >

                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box
                                    sx={{...visuallyHidden}}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
