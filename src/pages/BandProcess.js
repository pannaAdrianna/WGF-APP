import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import Page from '../components/Page';


import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSearch, BlogPostsSort } from '../sections/@dashboard/blog';
import POSTS from '../_mock/blog';


export default function Band() {

  return (
    <Page title='Dashboard: Band Connecting Process'>
      <Container>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
          <Typography variant='h4' gutterBottom>
            Process odczytu z opaski
          </Typography>
          <Button variant='contained' component={RouterLink} to='#' startIcon={<Iconify icon='eva:plus-fill' />}>
            New Post
          </Button>
        </Stack>

      </Container>
    </Page>
  );

}
