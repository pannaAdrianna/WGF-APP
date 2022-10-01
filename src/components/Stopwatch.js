import {useStopwatch} from "react-timer-hook";
import React, {useEffect, useState} from "react";


export function MyStopwatch(){

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });




    return (
        <div style={{textAlign: 'center'}}>
            <p>Last data refreshed:
            <div style={{fontSize: '16px'}}>
                <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div></p>
        </div>
    );
}
