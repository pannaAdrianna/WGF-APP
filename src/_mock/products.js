import { filter } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';

import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';

import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import { db } from '../Firebase';
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
import PatientDialog from '../sections/@dashboard/patient/PatientDialog';
import { useAuth } from '../sections/auth/contexts/AuthContext';
import {fDate, fDateTime, formatDate} from "../utils/formatTime";
import {applySortFilter} from "../utils/comparators";

const TABLE_HEAD = [
  { id: 'id', label: 'uuid', alignRight: false },
  { id: 'creation_date', label: 'Data dodatnia', alignRight: false },
  { id: 'id_wgf', label: 'WGF ID', alignRight: false },
  { id: 'pesel', label: 'Pesel', alignRight: false },
  { id: 'first_name', label: 'First Name', alignRight: false },
  { id: 'last_name', label: 'Last Name', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}


export default function Games() {

  const { user } = useAuth();
  const navigate = useNavigate();


  const [player, setPlayer] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = query(collection(db, 'players'));
  const fetchPlayers = async () => {
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.docs.forEach((doc) => {
      items.push(doc.data());
    });
    setPlayer(items);
    setRows(items);
    setLoading(false);
  };


  useEffect(() => {
    console.log('Players');
    fetchPlayers().then(r => {
      console.log('fetch');
    });

    // eslint-disable-next-line
  }, []);


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
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - player.length) : 0;

  const filteredUsers = applySortFilter(player, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const showInfo = (row) => {
    console.log('pesel', row.pesel);


    console.log('Players Table on INFO button click');
    setSelectedPatient({ pesel: row.pesel, name: row.name, surname: row.surname, id: row.id});
    handleClickOpen();
  };


  return (
      <Page title='Player'>
        <Container>
          <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
            <Typography variant='h4' gutterBottom>
              Players
            </Typography>
            <Button variant='contained' onClick={() => {
              navigate('/dashboard/add-player');
            }} startIcon={<Iconify icon='eva:plus-fill' />}>
              New Patient
            </Button>
          </Stack>
          {loading ? <h1>Loading... {player.length}</h1> :
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
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                          order={order}
                          orderBy={orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={player.length}
                          numSelected={selected.length}

                      />
                      <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => showInfo(row)}
                            >
                              <TableCell align='center'>{i + 1}</TableCell>
                              <TableCell align='center'>{row.id.slice(0,3)}</TableCell>
                              <TableCell align='center'>{fDateTime(row.createdAt.toDate())}</TableCell>
                              <TableCell align='center'>{row.wgf_temp_id}</TableCell>

                              <TableCell align='left'>
                                {row.pesel}
                              </TableCell>

                              <TableCell align='left'>{row.name}</TableCell>
                              <TableCell align='left'>{row.surname}</TableCell>
                              {/*  <TableCell align='left'>
                          <Button style={{ background: 'lightgreen' }} onClick={() => showInfo(row)}>Info</Button>


                          <Button style={{ background: 'red' }}
                                  onClick={() => deletePatient(row)}>Delete</Button>
                              dodać potwierdzenie przy usuwaniu

                        </TableCell>*/}
                              {selectedPatient ?
                                  <PatientDialog onClose={handleClose}  open={open}
                                                 player={selectedPatient} /> : null}
                              {/*<TableCell>Unknown</TableCell>*/}
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
