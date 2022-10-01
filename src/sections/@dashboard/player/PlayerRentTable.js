import React, {useEffect, useState} from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useNavigate} from 'react-router-dom';


import {checkErrorCode, db} from '../../../Firebase';
import {collection, getDoc, getDocs, query, where} from 'firebase/firestore';
import PropTypes from 'prop-types';

import Test from './test/Test';
import {useAuth} from '../../auth/contexts/AuthContext';
import {fDateTime, fDateTimeSuffix, formatDate, fuckDate} from '../../../utils/formatTime';
import Label from "../../../components/Label";
import {UserListHead} from "../user";
import RentalTableHead from "../rentals/RentalTableHead";
import {TablePagination} from "@material-ui/core";
import {MyStopwatch} from "../../../components/Stopwatch";
import {CircularProgressWithLabel} from "../../../components/CircularProgressWithLabel";
import {LoadingButton} from "@mui/lab";
import {Button, Container, Stack, Typography} from '@mui/material';

const TABLE_HEAD = [
    // { id: 'id', label: 'uuid', alignRight: false },
    // { id: 'creation_date', label: 'Data dodatnia', alignRight: false },
    // { id: 'id_wgf', label: 'WGF ID', alignRight: false },
    {id: 'game_id', label: 'Game ID', alignRight: false},
    {id: 'status', label: 'Status', alignRight: false},
    {id: 'rentalStartTs', label: 'Start Timestamp', alignRight: false},
    {id: 'rentalEndTs', label: 'End Timestamp', alignRight: false},
    {id: ''},
];


const PlayerRentTable = (props) => {


    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [rentals, setRentals] = useState([]);
    const {pesel, id} = props;


    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [playerStatus, setPlayerStatus] = useState('clear');

    // dla tabeli wartosci
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('status');
    const [selected, setSelected] = useState([]);

    // do paginacji
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const rentals_ref = query(collection(db, `rentals/${id}/rentals`));
    const fetchPlayerRentals = async () => {
        const querySnapshot = await getDocs(rentals_ref);
        const items = [];
        querySnapshot.docs.forEach((doc) => {
            if (progress + 1 < 100) setProgress(progress + 1)
            items.push(doc.data());
        });
        setLoading(false);
        setProgress(100)
        return items
    };


    useEffect(() => {
        console.log(id)
        refreshData()
        // eslint-disable-next-line
    }, []);


    function refreshData() {
        setLoading(true);
        fetchPlayerRentals().then(r => {
            console.log('response', r)
            setRows(r);
            setRentals(r);
        }).catch(err => {
            let message = checkErrorCode(err.code);
            console.log(message)
        })

    }


    return (

        <div>
            {loading ? null : <>
                <MyStopwatch/>
                <Button variant='contained'
                        onClick={refreshData}>
                    Fetch rentals
                </Button>

            </>

            }
            {loading ? <LoadingButton loading={loading} variant="outlined"/> :
                <>
                    {rows.length === 0 ?
                        <div>
                            <h4>No rentals yet</h4>
                        </div> :

                        <TableContainer>
                            <Table size='sm' aria-label='simple table'
                                   style={{background: 'white'}}>
                                <RentalTableHead order={order}
                                                 orderBy={orderBy}
                                                 headLabel={TABLE_HEAD}
                                                 rowCount={rows.length}
                                />

                                <TableBody style={{padding: 10, gap: 10}}>
                                    {rows.map((row, i) => (

                                        <TableRow
                                            key={i}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >

                                            <TableCell align='center'>{i + 1}</TableCell>
                                            <TableCell align='center'>{row.id}</TableCell>
                                            <TableCell align="center">

                                                <Label variant="ghost"
                                                       color={(row.status === 'rented' && 'error') || 'success'}>
                                                    {row.status}
                                                </Label>
                                            </TableCell>
                                            <TableCell
                                                align='center'>{fDateTime(row.rentalStartTs.toDate())}</TableCell>
                                            <TableCell
                                                align='center'>{fDateTime(row.rentalEndTs.toDate())}</TableCell>


                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={rentals.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />


                </>}


        </div>
    );
};
PlayerRentTable.propTypes = {
    pesel: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,

};
export default PlayerRentTable;
