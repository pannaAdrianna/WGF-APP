import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { DashboardLayout } from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//

import Patient from './pages/Patient';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import {DashboardApp} from './pages/DashboardApp';
import Band from './pages/Band/BandProcess';
import { EEGTest } from './pages/EEGTest';
import AddFile from './sections/@dashboard/patient/test/AddFile';

import PatientForm from './sections/@dashboard/patient/PatientForm';


// ----------------------------------------------------------------------

export default function Router() {

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'patients', element: <Patient /> },


        { path: 'add-patient', element: <PatientForm /> },
        {
          path: 'test',
          children: [
            { path: 'add-test', element: <EEGTest /> },
            { path: 'add-file', element: <AddFile /> },
            { path: 'band', element: <Band /> },
          ],
        }],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to='/login' /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    { path: '*', element: <Navigate to='/404' replace /> },
  ]);
}
