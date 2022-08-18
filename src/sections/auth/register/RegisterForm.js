import * as Yup from 'yup';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, Alert, IconButton, InputAdornment, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import CloseIcon from '@mui/icons-material/Close';
import { checkErrorCode, registerWithEmailAndPassword } from '../../../Firebase';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';
import { useAuth } from '../contexts/AuthContext';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const [open, setOpen] = useState(true);

  const onSubmit = (data) => {

    console.log('Register');
    console.log('data', data);

    setLoading(true);
    setError('');
    signup(data.email, data.password)
      .then((res) => {

        console.log(res.user);

        navigate('/login', { replace: true });
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

  return (

    <FormContainer
      onSuccess={onSubmit}
    >

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
        <TextFieldElement name='firstName' label='First name' required />
        <TextFieldElement name='lastName' label='Last name' required />
        <TextFieldElement name='email' label='Email' required />
        <PasswordElement name='password' label='Password' required />
        <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={loading}>
          Sign Up
        </LoadingButton>
      </Stack>


    </FormContainer>
  );
};
