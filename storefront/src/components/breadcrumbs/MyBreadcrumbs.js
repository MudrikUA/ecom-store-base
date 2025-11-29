import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

export default function MyBreadcrumbs({product, category}) {
  product = {};
  category= {};

  function getBreadcrumbsForProduct (product){
    return [
      <Link underline="hover" key="1" color="inherit" href="/">
        Home
      </Link>,
      // <Link
      //   underline="hover"
      //   key="2"
      //   color="inherit"
      //   href="/material-ui/getting-started/installation/"
      //   onClick={handleClick}
      // >
      //   Core
      // </Link>,
      // <Typography key="3" sx={{ color: 'text.primary' }}>
      //   Breadcrumb
      // </Typography>,
    ];
  }

  function getBreadcrumbsForCategory (category) {
    return [
      <Link underline="hover" key="1" color="inherit" href="/">
        Home
      </Link>,
      // <Link
      //   underline="hover"
      //   key="2"
      //   color="inherit"
      //   href="/material-ui/getting-started/installation/"
      // >
      //   Core
      // </Link>,
      // <Typography key="3" sx={{ color: 'text.primary' }}>
      //   Breadcrumb
      // </Typography>,
    ];
  }

  const breadcrumbs = product ? getBreadcrumbsForProduct(product) : getBreadcrumbsForCategory(category);

  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={'>'}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}