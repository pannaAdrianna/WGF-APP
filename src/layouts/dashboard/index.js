import { useState } from 'react';
import { Navigate, Outlet, useOutlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, auth_user, db } from '../../Firebase';
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuth } from '../../sections/auth/contexts/AuthContext';


// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export const DashboardLayout = (props) => {
  const [open, setOpen] = useState(false);
  const {user} = useAuth()


  const outlet = useOutlet();

  if (!user) {
    return <Navigate to='/login' />;
  }
  else{
    console.log('DashboardLayoutProvider User UID', user.uid)
  }

/*  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };*/

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        {outlet}
      </MainStyle>
    </RootStyle>
  );
};
