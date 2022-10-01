import {CircularProgress, Stack, Typography} from "@mui/material";
import React from "react";

export function CircularProgressWithLabel(props) {
    return (
        <Stack direction='row'>
            <CircularProgress variant='determinate' {...props} />
            <Typography variant='caption' component='div' color='text.secondary'>
                {`${Math.round(props.value)}%`}
            </Typography>

        </Stack>
    );
}
