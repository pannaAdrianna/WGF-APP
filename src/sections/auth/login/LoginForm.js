import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useOutlet } from 'react-router-dom';

import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Box,
  FormControl,
} from '@mui/material';
import { Alert, LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { useAuth } from '../contexts/AuthContext';
import { checkErrorCode } from '../../../Firebase';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement, PasswordElement } from 'react-hook-form-mui';
// ----------------------------------------------------------------------

export default function LoginForm() {

  const outlet = useOutlet();

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    setError('');
    console.log('login', data);
    login(data.email, data.password)
      .then((res) => {

        // console.log(res.user)

        navigate('/dashboard/app', { replace: true });
      })
      .catch(err => {
        let message = checkErrorCode(err.code);
        setErrorType('error');
        setError(message);


      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  };


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


  return (
    /* <FormikProvider value={formik}>
       {error && <Alert
         action={
           <IconButton
             aria-label='close'
             color='inherit'
             size='small'
             onClick={() => {
               setOpen(false);
             }}
           >
             <CloseIcon fontSize='inherit' />
           </IconButton>
         }
         severity={errorType}
         sx={{ mb: 2 }}
       >
         {error}
       </Alert>}
       <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
         <Stack spacing={3}>
           <TextField
             fullWidth
             autoComplete='username'
             type='email'
             label='Email address'
             {...getFieldProps('email')}
             error={Boolean(touched.email && errors.email)}
             helperText={touched.email && errors.email}
           />

           <TextField
             fullWidth
             autoComplete='current-password'
             type={showPassword ? 'text' : 'password'}
             label='Password'
             {...getFieldProps('password')}
             InputProps={{
               endAdornment: (
                 <InputAdornment position='end'>
                   <IconButton onClick={handleShowPassword} edge='end'>
                     <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                   </IconButton>
                 </InputAdornment>
               ),
             }}
             error={Boolean(touched.password && errors.password)}
             helperText={touched.password && errors.password}
           />
         </Stack>

         <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ my: 2 }}>
           <FormControlLabel
             control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
             label='Remember me'
           />

           <Link component={RouterLink} variant='subtitle2' to='#' underline='hover'>
             Forgot password?
           </Link>
         </Stack>

         <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={loading}>
           Login
         </LoadingButton>
       </Form>
       {outlet}
     </FormikProvider>*/
    <FormContainer
      onSuccess={onSubmit}
    >
      {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
      {error && <Alert
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
        severity={errorType}
        sx={{ mb: 2 }}
      >
        {error}
      </Alert>}

      <Stack spacing={3}>
        <TextFieldElement name='email' label='Email' required />
        <PasswordElement name='password' label='Password' required />
        <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={loading}>
          Login
        </LoadingButton>
      </Stack>


    </FormContainer>
  );
}
