import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Fragment, useEffect, useState } from 'react';
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
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
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
import PatientDialog from './Patient/PatientDialog';
import { useAuth } from '../sections/auth/contexts/AuthContext';

const TABLE_HEAD = [
  { id: 'pesel', label: 'Pesel', alignRight: false },
  { id: 'firstName', label: 'First Name', alignRight: false },
  { id: 'lastName', label: 'Last Name', alignRight: false },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Patient() {

  const { user } = useAuth();
  const navigate = useNavigate();



  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = query(collection(db, 'patients'), where('owner', '==', user.uid));
  const fetchPatients = async () => {
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.docs.forEach((doc) => {
      items.push(doc.data());
    });
    setPatients(items);
    setLoading(false);
  };


  useEffect(() => {
    console.log('Patients');
    fetchPatients().then(r => {
      console.log('fetch');
    });
    // getPatients()
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
      const newSelecteds = patients.map((n) => n.pesel);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

  const filteredUsers = applySortFilter(patients, getComparator(order, orderBy), filterName);

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

  function showInfo(row) {
    console.log('Pateints Table on INFO button click');
    setSelectedPatient(row);
    handleClickOpen();
  }


  return (
    <Page title='Patient'>
      <Container>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
          <Typography variant='h4' gutterBottom>
            Patient
          </Typography>
          <Button variant='contained' onClick={() => {
            navigate('/dashboard/add-patient');
          }} startIcon={<Iconify icon='eva:plus-fill' />}>
            New Patient
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={patients.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, surname, pesel, birthDay, createdAt, owner, ownerEmail, tests } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role='checkbox'
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={(event) => showInfo(event, name)}
                      >
                        <PatientDialog
                          onClose={handleClose}
                          open={open}
                          pesel={row.pesel}
                        />
                        <TableCell padding='checkbox'>
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component='th' scope='row' padding='none'>
                          <Stack direction='row' alignItems='center' spacing={2}>
                            {/*<Avatar alt={name} src={avatarUrl} />*/}
                            <Typography variant='subtitle2' noWrap>
                              {pesel}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align='left'>{name}</TableCell>
                        <TableCell align='left'>{surname}</TableCell>

                          {/*<Button style={{ background: 'red' }}*/}
                          {/*        onClick={() => deletePatient(row)}>Delete</Button>*/}
                          {/*    dodać potwierdzenie przy usuwaniu*/}


                        {/*<TableCell align='left'>{isVerified ? 'Yes' : 'No'}</TableCell>*/}
                        {/*<TableCell align='left'>*/}
                        {/*  <Label variant='ghost' color={(status === 'banned' && 'error') || 'success'}>*/}
                        {/*    {sentenceCase(status)}*/}
                        {/*  </Label>*/}
                        {/*</TableCell>*/}

                        <TableCell align='right'>
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={patients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
