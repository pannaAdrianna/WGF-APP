import {MenuItem, Select} from "@material-ui/core";
import React, {useEffect, useState} from "react";


export function RefreshingSelect(props){


    return(

        <Select
            onChange={(e) => props.myIntervalChild(parseInt(e.target.value))}
            onChangeCapture={(e) => props.myIntervalChild(parseInt(e.target.value))}
            defaultValue={3600}
        >
            <MenuItem value={10}>10 sec</MenuItem>
            <MenuItem value={30}>30 sec</MenuItem>
            <MenuItem value={60}>60 sec</MenuItem>
            <MenuItem value={3600} defaultChecked={true}>1 h</MenuItem>
        </Select>
    )
}
