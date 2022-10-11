import {filter} from 'lodash';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, CircularProgress,
} from '@mui/material';
// components
import Page from '../components/Page';

import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';

import {UserListHead, UserListToolbar, UserMoreMenu} from '../sections/@dashboard/user';
import {checkErrorCode, db} from '../Firebase';
import {FormContainer} from 'react-hook-form-mui';
import {
    getFirestore,
    collection,
    query,
    doc,
    where,
    getDocs,
    updateDoc,
    deleteField,
    setDoc,
} from 'firebase/firestore';
import {useAuth} from '../sections/auth/contexts/AuthContext';

import {descendingComparator} from "../utils/comparators";
import PlayerInfoDialog from "../sections/@dashboard/player/PlayerInfoDialog";
import IconButton from "../theme/overrides/IconButton";
import {FormControl, Grid, MenuItem, Select, Snackbar} from "@material-ui/core";
import {MyStopwatch} from "../components/Stopwatch";
import SearchNotFound from "../components/SearchNotFound";
import PlayerListHead from "../sections/@dashboard/player/PlayerListHead";
import PlayerListToolbar from "../sections/@dashboard/player/PlayerListToolbar";
import {CircularProgressWithLabel} from "../components/CircularProgressWithLabel";
import {useForm} from "react-hook-form";
import {RefreshingSelect} from "../components/RefreshingSelect";


const TABLE_HEAD = [
    // { id: 'id', label: 'uuid', alignRight: false },
    // { id: 'creation_date', label: 'Data dodatnia', alignRight: false },
    // { id: 'id_wgf', label: 'WGF ID', alignRight: false },
    // {id: 'pesel', label: 'Pesel', alignRight: false},
    {id: 'first_name', label: 'First Name', alignRight: false},
    {id: 'last_name', label: 'Last Name', alignRight: false},
    {id: ''},
];


export default function Player() {


    const navigate = useNavigate();


    const [player, setPlayers] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState(0);
    const [intervalSet, setMyInterval] = useState(3600);


    const q = query(collection(db, 'players'));
    const fetchPlayers = async () => {
        const querySnapshot = await getDocs(q);
        const items = [];
        setProgress(0)
        querySnapshot.docs.forEach((doc) => {
            items.push(doc.data());
            if (progress + 1 < 100) setProgress(progress + 1)
        });
        setLoading(false);
        setProgress(100)
        return items
    };


    useEffect(() => {
        refreshData()

        const interval = setInterval(() => {
            refreshData()

        }, intervalSet * 1000,);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [intervalSet]);


    function refreshData() {
        console.log('fetching data')
        setLoading(true);
        fetchPlayers().then(r => {
            setPlayers(r);
            setRows(r);

        }).catch(err => {
            let message = checkErrorCode(err.code);

        })

    }

    // paginacja
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');

    const [filterSurname, setFilterSurname] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = player.map((n) => n.pesel);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        console.log('selected Index', selectedIndex);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterSurname(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - player.length) : 0;

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function applySortFilter(array, comparator, query) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        if (query) {
            return filter(array, (_player) => _player.surname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis.map((el) => el[0]);
    }


    const filteredPlayers = applySortFilter(player, getComparator(order, orderBy), filterSurname);

    const isUserNotFound = filteredPlayers.length === 0;


    const [openInfoPlayerAlert, setOpenInfoPlayerAlert] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({});


    const onCloseDialog = () => {
        setOpenInfoPlayerAlert(false);
        setOpenInfoPlayerAlert(false)
        // setSelectedValue(value);
    };

    function handleIntervalChange(data){
        console.log('had', data)
        setMyInterval(data)
        refreshData()
    }

    return (
        <Page title='Players'>
            <Container>
                <Typography variant='h4' gutterBottom>
                    Players
                </Typography>

                <div>
                    <Typography variant='h4' gutterBottom>
                        Data refresh every {intervalSet}

                    </Typography>
                    <RefreshingSelect myIntervalChild={handleIntervalChange}/>


                </div>
                <Stack sx={{minWidth: 300}} direction='row' alignItems='center' spacing={2}
                       justifyContent='space-between' mb={2} paddingRight={2}>
                    {loading ? <>Loading...<CircularProgressWithLabel value={progress}/></> : <> <MyStopwatch/>
                        <Button variant='contained'
                                onClick={refreshData}>
                            Refresh data
                        </Button> </>
                    }

                    <Button variant='contained' onClick={() => {
                        navigate('/dashboard/add-player');
                    }} startIcon={<Iconify icon='eva:plus-fill'/>}>
                        New Player
                    </Button>
                </Stack>
                {loading ? null :
                    <Card>
                        <PlayerListToolbar filterName={filterSurname} onFilterName={handleFilterByName}/>
                        <Scrollbar>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <TableContainer sx={{minWidth: 300}}>
                                <Table>
                                    <PlayerListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={player.length}
                                        numSelected={selected.length}
                                    />
                                    <TableBody>
                                        {filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                onClick={() => {
                                                    if (openInfoPlayerAlert === false) {
                                                        setSelectedPlayer(row);
                                                        console.log('sel', selectedPlayer)
                                                        setOpenInfoPlayerAlert(true);
                                                    }
                                                }}

                                            >
                                                <TableCell align='center'>{i + 1}</TableCell>
                                                {/*<TableCell align='center'>{row.id.slice(0,3)}</TableCell>*/}
                                                {/*<TableCell align='center'>{fDateTime(row.createdAt.toDate())}</TableCell>*/}
                                                {/*<TableCell align='center'>{row.wgf_temp_id}</TableCell>*/}

                                                {/*<TableCell align='left'>{row.pesel}</TableCell>*/}

                                                <TableCell align='left'>{row.name}</TableCell>
                                                <TableCell align='left'>{row.surname}</TableCell>
                                                <TableCell align='left'>{"Wybierz"}</TableCell>
                                                {selectedPlayer ?
                                                    <PlayerInfoDialog open={openInfoPlayerAlert} onClose={onCloseDialog}
                                                                      player={selectedPlayer}/> : null}
                                                {/*<TableCell>Unknown</TableCell>*/}
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                    {isUserNotFound && (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                    <SearchNotFound searchQuery={filterSurname}/>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}

                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Scrollbar>


                    </Card>
                }


            </Container>
        </Page>
    );
}
