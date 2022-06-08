import { Button, Card } from '@material-ui/core';
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


const PatientTestTable = (props) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const { pesel } = props;


  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState({});
  let datePattern = 'dd.MM.yyyy hh:mm:ss';
  // let date = new Date("2016-01-04 10:34:23");
  // let formattedDate = format(date, datePattern);


  const [isChecked, setChecked] = useState(false);


  const [searched, setSearched] = useState('');


  useEffect(() => {


    console.log('Patients Testing Table');
    console.log('pesel z props', pesel);
    showInfo().then(r => {
      console.log('R', r);
    });


  }, []);

  async function showInfo() {
    console.log('Show Info click');
    setLoading(true);
    let productsWithUser = [];
    let myTests = [];
    const querySnaphot = await getDocs(collection(db, `tests/${pesel}/tests`));

    querySnaphot.forEach((doc) => {
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


    });
    console.log('Patients table len', productsWithUser.length);
    console.log(`Patients TABLE!!! all`, productsWithUser);
    setRows(productsWithUser);
    console.log('ROWS new: ', rows);
    let num = 0;
    console.log(`ROWS${num}: `, rows[num]);
    // console.log(`ROWS${num} createdAt: `, format(rows[num].createdAt.toDate(), datePattern))
    // console.log(`ROWS${num} createdAt: `, format(productsWithUser[num].createdAt.toDate(), datePattern))
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
              <Table sx={{ minWidth: 650 }} size='xl' aria-label='simple table'
                     style={{ background: 'white' }}>
                <TableHead>
                  <TableRow>

                    <TableCell>No</TableCell>
                    <TableCell align='center'>Date</TableCell>
                    <TableCell align='center'>Options</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (

                    <TableRow
                      key={i}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >

                      <TableCell align='center'>{i + 1}</TableCell>
                      <TableCell
                        // align='center'>{format(row.createdAt.toDate(), datePattern)}</TableCell>
                        align='center'>{(row.createdAt.toDate())}</TableCell>

                      <TableCell component='th' scope='row'>
                        <Button href={row.url}>Download</Button>
                        <Button onClick={() => navigate('/visualize-file', { filepath: row.url })}>Visualize</Button>
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

};
export default PatientTestTable;
