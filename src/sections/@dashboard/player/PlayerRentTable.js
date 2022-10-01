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
import {Button} from '@mui/material';
import Label from "../../../components/Label";


const PlayerRentTable = (props) => {


    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const {pesel, id} = props;


    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [playerStatus, setPlayerStatus] = useState('clear');


    const rentals_ref = query(collection(db, `rentals/${id}/rentals`));
    const fetchPlayerRentals = async () => {
        const querySnapshot = await getDocs(rentals_ref);
        const items = [];
        querySnapshot.docs.forEach((doc) => {
            items.push(doc.data());

        });

        const rentals = [];
        items.forEach((item) => {
            if (progress + 1 < 100) setProgress(progress + 1)
            console.log('item.status', item.id, item.status)
            if (item.status === 'rented') {
                console.log('not clear')
                setPlayerStatus('not clear')
            }
            rentals.push(item);

        });
        setLoading(false);
        setProgress(100)
        console.log('inn',props.callback.playerStatus)
        return items
    };


    useEffect(() => {
        refreshData()
        // eslint-disable-next-line
    }, [playerStatus]);


    function refreshData() {
        setLoading(true);
        fetchPlayerRentals().then(r => {
            setRows(r);
        }).catch(err => {
            let message = checkErrorCode(err.code);
        })

    }


    return (

        <>
            {loading ? <h1>Loading...</h1> :
                <>
                    {rows.length === 0 ?
                        <div>
                            <h4>No rents yet</h4>
                        </div> :

                        <TableContainer>
                            <Table size='xl' aria-label='simple table'
                                   style={{background: 'white'}}>
                                <TableHead>
                                    <TableRow>

                                        <TableCell>No</TableCell>
                                        <TableCell align='center'>Game ID</TableCell>
                                        <TableCell align='center'>Rental Date</TableCell>
                                        <TableCell align='center'>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{padding: 10, gap: 10}}>
                                    {rows.map((row, i) => (

                                        <TableRow
                                            key={i}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >

                                            <TableCell align='center'>{i + 1}</TableCell>
                                            <TableCell align='center'>{row.id}</TableCell>
                                            <TableCell
                                                // align='center'>{format(row.createdAt.toDate(), datePattern)}</TableCell>
                                                align='center'>{fDateTime(row.createdAt.toDate())}</TableCell>
                                            <TableCell align="left">
                                                <Label variant="ghost"
                                                       color={(row.status === 'rented' && 'error') || 'success'}>
                                                    {row.status}
                                                </Label>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}


                </>}


        </>
    );
};
PlayerRentTable.propTypes = {
    pesel: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,

};
export default PlayerRentTable;
