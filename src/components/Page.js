import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet-async';
import React, {forwardRef} from 'react';
// @mui
import {Box} from '@mui/material';


import {SnackbarProvider} from 'notistack';
// ----------------------------------------------------------------------

const Page = forwardRef(({children, title = '', meta, ...other}, ref) => (

    <>
        <Helmet>
            <title>{`${title} | WGF ${new Date().getFullYear()}`}</title>
            {meta}
        </Helmet>

        <Box ref={ref} {...other}>
            {children}
        </Box>
    </>

));

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    meta: PropTypes.node,
};

export default Page;
