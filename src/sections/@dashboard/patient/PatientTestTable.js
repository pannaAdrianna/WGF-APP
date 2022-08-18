
import React, { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useNavigate } from 'react-router-dom';


import { db } from '../../../Firebase';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import PropTypes from 'prop-types';

import Test from './test/Test';
import { useAuth } from '../../auth/contexts/AuthContext';
import { fDateTimeSuffix, formatDate, fuckDate } from '../../../utils/formatTime';
import { Button } from '@mui/material';


const PatientTestTable = (props) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const { pesel , id} = props;


  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState({});
  let datePattern = 'dd.MM.yyyy hh:mm:ss';
  // let date = new Date("2016-01-04 10:34:23");
  // let formattedDate = format(date, datePattern);


  const [isChecked, setChecked] = useState(false);


  const [searched, setSearched] = useState('');


  useEffect(() => {


    console.log('Patients Testing Table');
    console.log('id z props', id);
    showInfo().then(r => {
      console.log('R', r);
    });


  }, []);

  async function showInfo() {
    console.log('Show Info click');
    setLoading(true);
    let productsWithUser = [];
    let myTests = [];

    const q = query(collection(db, `tests/${id}/tests`));

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.docs.forEach((doc) => {
      items.push(doc.data().tests);
    });

    setLoading(false);
    console.log('items', items);


    const myItems = [];
    items.forEach((item) => {

      console.log('Item', item);

      myItems.push(item);


    });
    setRows(myItems);


    /* querySnaphot.forEach((doc) => {
       console.log('IN Query', doc);
       let newItem = { id: doc.id, ...doc.data().tests };
       let temp;
       if (newItem.tests) {
         let userData = getDoc(newItem.tests);
         console.log('tescik: ', new Test(newItem));
         if (userData) {
           newItem.tests = { testID: userData.id, ...userData.data() };
           temp = new Test(newItem.tests.data());
           // let temp = new Test(userData.id, userData.url)
           // console.log('temp: ', temp)
           // myTests.push(temp)
           productsWithUser.push(newItem);
         }
       } else {
         productsWithUser.push(newItem);
       }
       console.log('TEMP :', temp);


     });*/
    // console.log('Patients table len', productsWithUser.length);
    // console.log(`Patients TABLE!!! all`, productsWithUser);
    // setRows(productsWithUser);
    // console.log('ROWS new: ', rows);
    // let num = 0;
    // console.log(`ROWS${num}: `, rows[num]);
    setLoading(false);


  }

  return (

    <>
      {loading ? <h1>Loading...</h1> :
        <>
          {rows.length === 0 ?
            <div>
              <h4>No tests yet</h4>
            </div> :

            <TableContainer>
              <Table size='xl' aria-label='simple table'
                     style={{ background: 'white' }}>
                <TableHead>
                  <TableRow>

                    <TableCell>No</TableCell>
                    <TableCell align='center'>Date</TableCell>
                    <TableCell align='center'>Options</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody style={{padding: 10, gap: 10}}>
                  {rows.map((row, i) => (

                    <TableRow
                      key={i}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >

                      <TableCell align='center'>{i + 1}</TableCell>
                      <TableCell
                        // align='center'>{format(row.createdAt.toDate(), datePattern)}</TableCell>
                        align='center'>{formatDate(row.createdAt.toDate())}</TableCell>


                      <TableCell align='center' component='th' scope='row'>
                        <Button variant='contained' href={row.url}>Download</Button>
                        {/*<Button variant='contained'*/}
                        {/*        onClick={() => navigate('/visualize-file', { state: { filepath: row.url } })}>Visualize</Button>*/}
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
PatientTestTable.propTypes = {
  pesel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,

};
export default PatientTestTable;
