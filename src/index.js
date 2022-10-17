// scroll bar
import React from 'react';
import 'simplebar/src/simplebar.css';

import ReactDOM from "react-dom/client";

import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

//
import App from './App';

import reportWebVitals from './reportWebVitals';
import {AppProvider} from '@shopify/polaris';

import enTranslations from '@shopify/polaris/locales/en.json';
import {AuthProvider} from './sections/auth/contexts/AuthContext';
import {SnackbarProvider} from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>

        <BrowserRouter>
            <AuthProvider>

                <HelmetProvider>
                    < SnackbarProvider maxSnack={3}>

                        <App/>
                    </SnackbarProvider>

                </HelmetProvider>

            </AuthProvider>
        </BrowserRouter>

    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
