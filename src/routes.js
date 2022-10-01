import React from 'react';

// layouts
import { DashboardLayout } from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//

import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import MyTest from './pages/MyTest';
import {DashboardApp} from './pages/DashboardApp';

import {Navigate, useRoutes} from "react-router-dom";
import Player from "./pages/Player";
import Games from "./pages/Games";
import GameForm from "./sections/@dashboard/games/components/GameForm";
import AddFile from "./sections/@dashboard/player/test/AddFile";
import PlayerForm from "./sections/@dashboard/player/PlayerForm";


// ----------------------------------------------------------------------

export  default function Router() {

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },

        { path: 'players', element: <Player /> },
        { path: 'games', element: <Games /> },



        { path: 'add-player', element: <PlayerForm /> },
        { path: 'add-game', element: <GameForm /> },
        {
          path: 'test',
          children: [
            { path: 'add-file', element: <AddFile /> },
          ],
        },

        ],



    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to='/login' /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'mytest', element: <MyTest /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    { path: '*', element: <Navigate to='/404' replace /> },
  ]);
}
