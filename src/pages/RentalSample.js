import {filter} from 'lodash';
import React, {Fragment, useEffect, useState} from 'react';
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

import {applySortFilter, getComparator} from "../utils/comparators";
import Label from "../components/Label";


import {GameMoreMenu} from "../sections/@dashboard/games/components/GameMoreMenu";
import {RefreshingSelect} from "../components/RefreshingSelect";
import {CircularProgressWithLabel} from "../components/CircularProgressWithLabel";
import {MyStopwatch} from "../components/Stopwatch";
import GamesListHead from "../sections/@dashboard/games/components/GamesListHead";
import GamesListToolbar from "../sections/@dashboard/games/components/GameListToolbar";
import GameDialog from "../sections/@dashboard/games/components/dialogs/GameDialog";


const TABLE_HEAD = [
    // { id: 'id', label: 'id', alignRight: false },
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'status', label: 'Status', alignRight: false},
    {id: 'gameType', label: 'Game Type', alignRight: false},
    {id: 'age', label: 'Age', alignRight: false},
    {id: 'size', label: 'Box Size', alignRight: false},
    {id: 'min', label: 'Min', alignRight: false},
    {id: 'max', label: 'Max', alignRight: false},
    {id: 'duration', label: 'Duration', alignRight: false},
    {id: ''},
];


export default function RentalSample() {


    const navigate = useNavigate();

    // lisy gier
    const [games, setGames] = useState([]);
    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);


    const [intervalSet, setMyInterval] = useState(3600);


    const q = query(collection(db, 'games'));
    const fetchGames = async () => {
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
        fetchGames().then(r => {
            setGames(r);
            setRows(r);

        }).catch(err => {
            let message = checkErrorCode(err.code);

        })

    }


//paginacja
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = games.map((n) => n.pesel);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        let name = row.name
        // const selectedIndex = selected.indexOf(name);
        const selectedIndex = selected.indexOf(row);
        console.log('selected Index', selectedIndex);
        console.log('is selected: 0 if not -1', selectedIndex)
        console.log('before selected', selected)
        let newSelected = [];
        // if is not selected
        if (selectedIndex === -1) {
            console.log('select', row.name)
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            console.log('unselect', row.name)
            // newSelected = newSelected.concat(selected.slice(1));
            newSelected = newSelected.concat(Object.entries(selected).slice(1));
        }else if (selectedIndex > 0){
            // unselect dla jednego wyniku
            console.log('selected index >0', selectedIndex)
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
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0;

    const filteredGames = applySortFilter(games, getComparator(order, orderBy), filterName);

    //dialogi
    const [open, setOpen] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // setSelectedValue(value);
    };

    const [selectedGame, setSelectedGame] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    // odczyt danych
    function handleIntervalChange(data) {
        console.log('had', data)
        setMyInterval(data)
        refreshData()
    }


    return (
        <Page title='Rent a Game'>
            <Container>
                <Typography variant='h3' gutterBottom>
                    Rent a Game
                </Typography>
                <div>
                    <Typography variant='h6' gutterBottom>
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
                </Stack>
                {loading ? <h1>Loading... {games.length}</h1> :


                    <Card>
                        <Scrollbar>
                            <GamesListToolbar filterName={filterName} onFilterName={handleFilterByName}
                                              gamesList={selected}/>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <TableContainer sx={{minWidth: 800}}>
                                <Table size={'small'}>
                                    <GamesListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={games.length}
                                        numSelected={selected.length}


                                    />
                                    <TableBody>
                                        {filteredGames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                                            const isItemSelected = selected.indexOf(row) !== -1;

                                            return (

                                                <TableRow
                                                    key={row.id}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    tabIndex={-1}

                                                >
                                                    <GameDialog open={showInfoDialog} onClose={() => {
                                                        setShowInfoDialog(false)
                                                    }} game={selectedGame}/>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected}
                                                                  onChange={(event) => handleClick(event, row)}/>
                                                    </TableCell>
                                                    <TableCell align='left'
                                                               onClickCapture={() => {
                                                                   if (!showInfoDialog) {
                                                                       setSelectedGame(row)
                                                                       setShowInfoDialog(true)
                                                                   }
                                                               }}>{row.name}</TableCell>
                                                    <TableCell align="left">
                                                        <Label variant="ghost"
                                                               color={(row.status === 'rented' && 'error') || 'success'}>
                                                            {row.status}
                                                        </Label>
                                                    </TableCell>
                                                    <TableCell align='left'>{row.gameType}</TableCell>
                                                    <TableCell align='left'>{row.age}</TableCell>
                                                    <TableCell align='left'>{row.size}</TableCell>
                                                    <TableCell align='left'>{row.min}</TableCell>
                                                    <TableCell align='left'>{row.max}</TableCell>
                                                    <TableCell align='left'>{row.duration}</TableCell>
                                                    <TableCell align="right">
                                                        <GameMoreMenu game={selectedGame}/>
                                                    </TableCell>


                                                </TableRow>


                                            )
                                        })}
                                    </TableBody>
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
