import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import {styled} from '@mui/material/styles';
import {Button, Typography, Container, Box, Alert, IconButton, Stack} from '@mui/material';
import {FormContainer, PasswordElement, TextFieldElement} from 'react-hook-form-mui';

// components
import Page from '../components/Page';

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import * as Papa from "uuid";
import {capitalizeFirstLetter, namesFromMail} from "../utils/strings";
import {serverTimestamp} from "firebase/firestore";
import {game_size, game_types} from "../sections/@dashboard/games/enums/gameTypes";
import {addNewImported,addNewGame} from "../Database";

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function SimplePage() {

    const navigate = useNavigate();


    useEffect(() => {
        document.title = `New Game`;
    });


    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = `New Game`;
    });


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    const onSubmit = async (data) => {

        let id = uuidv4();


    }

    const [data, setData] = useState({});
    const [list, setList] = useState([]);

    const Papa = require("papaparse")
    ;
    const filePrasing = () => new Promise((resolve) => {

        let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVlCD74-LB_uQOs_xIdolwNC_UTt6z_42MoqgtiSji1sE3icv1W5TeOQd7DNdGmaH9_QMrXFp7CHW1/pub?output=csv"
        Papa.parse(url, {
            download: true,
            header: true,
            newline: "",
            complete: function (results, file) {
                resolve(results.data);

                setList(Array.from(results.data))
            }
        })
    })

    const getData = async () => {
        await filePrasing();
        console.log('lista', list)
        let counter = 0

        for(let i=0;i<list.length; i=i+100){
            const newGame = {
                name: capitalizeFirstLetter(list[i].tytul),
                status: 'available',
                id: uuidv4(),
                addedBy: 'admin',
                lastEditBy: 'admin',
                createdAt: serverTimestamp(),
                lastUpdate: serverTimestamp(),
                gameType: list[i].rodzaj,
                size: game_size.other,
                min: list[i].min,
                max: list[i].max,
                age: list[i].wiek.toString(),
                duration: list[i].czas_trwania.toString()

            };
            addNewGame(newGame)
            counter=counter+=1

        }
       /* list.forEach((game) => {

            const newGame = {
                name: capitalizeFirstLetter(game.tytul),
                status: 'available',
                id: uuidv4(),
                addedBy: 'admin',
                lastEditBy: 'admin',
                createdAt: serverTimestamp(),
                lastUpdate: serverTimestamp(),
                gameType: game.rodzaj,
                size: game_size.other,
                min: game.min,
                max: game.max,
                age: game.wiek.toString(),
                duration: game.czas_trwania.toString()

            };
            addNewImported(newGame)
            counter = counter + 100


        })*/


        console.log('dodano', counter)
        // console.log('imported', )


    }


    return (
        <Page title="Page">
            <Container>
                <ContentStyle sx={{textAlign: 'center', alignItems: 'center'}}>
                    <Typography variant="h3" paragraph>
                        MyTest
                    </Typography>

                    <Typography sx={{color: 'text.secondary'}}>
                        Test
                    </Typography>
                    <FormContainer
                        onSuccess={onSubmit}
                    >
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': {m: 1},
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Stack spacing={3}>
                                "54c2a729-90d0-45bc-ac71-3787070e4e61"
                                <TextFieldElement id='idPlayer' name='idPlayer' label='ID player' required/>
                                <TextFieldElement id='idGame' name='idGame' label='ID game' required/>
                            </Stack>

                            <Button onClick={onSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </FormContainer>

                    <Button to="/mygames" size="large" variant="contained" component={RouterLink}>
                        Go to mygames
                    </Button>
                    <Button size="large" variant="contained" onClick={getData}>
                        Add from google sheets
                    </Button>
                </ContentStyle>
            </Container>
        </Page>
    );
}
