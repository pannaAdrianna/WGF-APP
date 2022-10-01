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

import {getAllGames, writeNewPost} from "../Database";
import {GameMoreMenu} from "../sections/@dashboard/games/components/GameMoreMenu";


const TABLE_HEAD = [
    // { id: 'id', label: 'id', alignRight: false },
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'status', label: 'Status', alignRight: false},
    {id: ''},
];


export default function Games() {


    const navigate = useNavigate();


    const [games, setGames] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState(0);

    const q = query(collection(db, 'games'));
    const fetchGames = async () => {
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.docs.forEach((doc) => {
            items.push(doc.data());
            if (progress + 1 < 100) setProgress(progress + 1)
        });
        setLoading(false);
        setProgress(100)
        return items
    };


    useEffect(() => {
        console.log('Games');
        refreshData()

        // eslint-disable-next-line
    }, []);


    function refreshData() {
        fetchGames().then(r => {
            console.log('fetch');
            console.log(r)

            setGames(r);
            setRows(r);

        }).catch(err => {
            let message = checkErrorCode(err.code);

        })

    }




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
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0;

    const filteredGames = applySortFilter(games, getComparator(order, orderBy), filterName);


    const [open, setOpen] = useState(false);
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

    function CircularProgressWithLabel(props) {
        return (
            <Stack direction='row'>
                <CircularProgress variant='determinate' {...props} />
                <Typography variant='caption' component='div' color='text.secondary'>
                    {`${Math.round(props.value)}%`}
                </Typography>

            </Stack>
        );
    }


    return (
        <Page title='Games'>




            <Container>
                <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
                    <Typography variant='h4' gutterBottom>
                        Games {games.length}
                    </Typography>
                    <Button variant='contained' startIcon={ <CircularProgressWithLabel value={progress}/>} onClick={()=>{console.log('button clicked')}}>
                        Refresh Table
                    </Button>

                    <Button variant='contained' onClick={() => {
                        navigate('/dashboard/add-game');
                    }} startIcon={<Iconify icon='eva:plus-fill'/>}>
                        New Game
                    </Button>
                </Stack>
                {loading ? <h1>Loading... {games.length}</h1> :


                    <Card>
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
                            <TableContainer sx={{minWidth: 800}}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={games.length}
                                        numSelected={selected.length}

                                    />
                                    <TableBody>
                                        {filteredGames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (

                                            <TableRow
                                                key={row.id}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell align='center'>{i + 1}</TableCell>
                                                <TableCell align='left'>{row.name}</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost"
                                                           color={(row.status === 'rented' && 'error') || 'success'}>
                                                        {row.status}
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <GameMoreMenu game={{
                                                        id: row.id,
                                                        name: row.name,
                                                        status: row.status,
                                                        last_edited_by: row.lastEditBy
                                                    }} />
                                                </TableCell>


                                            </TableRow>
                                        ))}
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
